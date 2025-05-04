import { getCurrentUser } from "@/lib/auth";
import { clientConfig } from "@/lib/config";
import { dbAdmin as db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const SHORTEN_URL_EXPIRATION_TIME =
  Number.parseInt(process.env.SHORTEN_URL_EXPIRATION_TIME || "", 10) ||
  60 * 1000;

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (e: any) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 422 });
    }

    const currentUser = await getCurrentUser();

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
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (dbError: any) {
      console.error("Error creating Firestore document: ", dbError);
      return NextResponse.json(
        { error: "Failed to save URL" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error shortening URL: ", error);
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 },
    );
  }
}
