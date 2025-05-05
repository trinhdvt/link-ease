import { NextResponse } from "next/server";
import { removeExpiredUrls } from "@/features/url-shorten/url-service";

/**
 * Validates basic authentication credentials
 * @param request The incoming request
 * @returns Boolean indicating if authentication is valid
 */
async function authenticateRequest(request: Request): Promise<boolean> {
  // Get authorization header
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  // Get credentials from header
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
  const [username, password] = credentials.split(":");

  // Compare with environment variables
  const expectedUsername = process.env.INTERNAL_API_USERNAME;
  const expectedPassword = process.env.INTERNAL_API_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error("Authentication environment variables not properly set");
    return false;
  }

  return username === expectedUsername && password === expectedPassword;
}

/**
 * Removes all expired URLs from the 'urls' collection
 * This endpoint is meant to be called by a CRON job and is secured with basic auth
 */
export async function POST(request: Request) {
  // Authenticate the request
  const isAuthenticated = await authenticateRequest(request);

  if (!isAuthenticated) {
    console.warn("Unauthorized attempt to access cleanup endpoint");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await removeExpiredUrls();

    // Return appropriate response based on the service result
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error("Error in cleanup endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during cleanup",
      },
      { status: 500 }
    );
  }
}
