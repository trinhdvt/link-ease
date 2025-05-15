import { NextResponse } from "next/server";
import { removeExpiredUrls } from "@/features/url-shorten/url-service";
import {
  authenticateInternalRequest,
  cleanupOldRateLimits,
} from "@/features/auth/auth-services";

/**
 * Removes all expired URLs from the 'urls' collection
 * Removes all old rate limit documents from the 'rateLimits' collection
 * This endpoint is meant to be called by a CRON job and is secured with basic auth
 */
export async function POST(request: Request) {
  const isAuthenticated = await authenticateInternalRequest(request);

  if (!isAuthenticated) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const cleanUrlResult = await removeExpiredUrls();
    const cleanRateLimitResult = await cleanupOldRateLimits();

    const responseBody = {
      cleanUrlResult,
      cleanRateLimitResult,
    };

    if (cleanUrlResult.success && cleanRateLimitResult.success) {
      return NextResponse.json(responseBody, { status: 200 });
    }
    return NextResponse.json(responseBody, { status: 500 });
  } catch (error) {
    console.error("Error in cleanup endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during cleanup",
      },
      { status: 500 },
    );
  }
}
