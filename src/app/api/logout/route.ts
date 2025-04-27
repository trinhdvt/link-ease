import { serverConfig } from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(_req: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(serverConfig.authCookieName);

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
