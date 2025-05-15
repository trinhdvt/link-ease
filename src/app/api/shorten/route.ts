import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getCurrentUser } from "@/lib/auth";
import { clientConfig } from "@/lib/config";
import { dbAdmin as db } from "@/lib/firebaseAdmin";
import { z } from "zod";
import type { User } from "@/features/user/types";

const SHORTEN_URL_EXPIRATION_TIME =
  Number.parseInt(process.env.SHORTEN_URL_EXPIRATION_TIME || "", 10) ||
  60 * 1000;

const shortenRequestSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

class RateLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitExceededError";
  }
}

class InvalidRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRequestError";
  }
}

export async function POST(req: NextRequest) {
  let url: string;
  try {
    const body = await req.json();
    const validationResult = shortenRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Zod validation error: ", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    url = validationResult.data.url;
  } catch (e: unknown) {
    // Catch errors during req.json() parsing (if not valid JSON at all)
    if (e instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    // Catch any other unexpected errors during initial parsing
    const message =
      e instanceof Error
        ? e.message
        : "An unexpected error occurred during request parsing.";
    console.error("Unexpected error during request parsing:", message, e);
    return NextResponse.json(
      { error: "Internal server error during request parsing" },
      { status: 500 },
    );
  }

  const currentUser = await getCurrentUser();

  try {
    await checkRateLimit(req, currentUser);
  } catch (e: unknown) {
    if (e instanceof RateLimitExceededError) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again tomorrow." },
        { status: 429 },
      );
    }
    if (e instanceof InvalidRequestError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    console.error("Error during rate limiting mechanism (function call): ", e);
    return NextResponse.json(
      { error: "Internal server error during rate limit check." },
      { status: 500 },
    );
  }

  try {
    const now = Date.now();
    const expiresAt = now + SHORTEN_URL_EXPIRATION_TIME;

    const urlData: {
      original: string;
      expiresAt: number;
      ownerId?: string;
      createdAt?: number;
    } = {
      original: url,
      expiresAt: expiresAt,
      createdAt: now,
      ...(currentUser && { ownerId: currentUser.id }),
    };

    const createdDoc = await db.collection("urls").add(urlData);
    const newShortenedUrl = `${clientConfig.baseUrl}/${createdDoc.id}`;

    return NextResponse.json(
      { shortenedUrl: newShortenedUrl },
      { status: 200 },
    );
  } catch (dbError: unknown) {
    const message =
      dbError instanceof Error
        ? dbError.message
        : "Failed to save URL (DB operation)";
    console.error("Error creating Firestore document: ", message, dbError);
    return NextResponse.json({ error: "Failed to save URL" }, { status: 500 });
  }
}

const DAILY_LIMIT_AUTHENTICATED = 100;
const DAILY_LIMIT_UNAUTHENTICATED = 1;

/**
 * Checks and enforces rate limits based on the identifier and type.
 * Throws RateLimitExceededError if the limit is reached.
 * Throws other errors for underlying transaction issues.
 */
const checkRateLimit = async (
  req: NextRequest,
  currentUser?: User,
): Promise<void> => {
  let identifier: string | undefined;
  let limit: number;
  let identifierType: "user" | "ip";

  if (currentUser) {
    identifier = currentUser.id;
    limit = DAILY_LIMIT_AUTHENTICATED;
    identifierType = "user";
  } else {
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const xRealIp = req.headers.get("x-real-ip");

    if (xForwardedFor) {
      identifier = xForwardedFor.split(",")[0].trim();
    } else if (xRealIp) {
      identifier = xRealIp.trim();
    }

    limit = DAILY_LIMIT_UNAUTHENTICATED;
    identifierType = "ip";

    if (!identifier) {
      throw new InvalidRequestError(
        "Cannot process request (IP unidentified).",
      );
    }
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  const rateLimitDocId = `${identifierType}_${identifier}_${today}`;
  const rateLimitRef = db.collection("rateLimits").doc(rateLimitDocId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(rateLimitRef);
    const todayDateStringForDoc = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format for the document field

    if (!doc.exists) {
      if (limit > 0) {
        transaction.set(rateLimitRef, {
          count: 1,
          firstRequestAt: FieldValue.serverTimestamp(),
          dateString: todayDateStringForDoc,
        });
      }
    } else {
      const data = doc.data();
      const currentCount = data?.count || 0;
      if (currentCount >= limit) {
        throw new RateLimitExceededError("Rate limit exceeded.");
      }
      transaction.update(rateLimitRef, {
        count: FieldValue.increment(1),
      });
    }
  });
};
