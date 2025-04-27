import { NextRequest, NextResponse } from "next/server";
import { authAdmin } from "@/lib/firebaseAdmin";
import { serverConfig } from "@/lib/config";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    const expiresIn = serverConfig.authCookieOptions.maxAge * 1000;
    const sessionCookie = await authAdmin.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: serverConfig.authCookieName,
      value: sessionCookie,
      maxAge: serverConfig.authCookieOptions.maxAge,
      httpOnly: serverConfig.authCookieOptions.httpOnly,
      secure: serverConfig.authCookieOptions.secure,
      sameSite: "lax",
    });

    return NextResponse.json({ message: "Session cookie created" });
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json(
      { error: "Failed to create session cookie" },
      { status: 500 }
    );
  }
}
