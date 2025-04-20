import { NextResponse } from "next/server";
import { dbAdmin as db } from "@/lib/firebaseAdmin";
import { getAuthenticatedUser } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const authorization = req.headers.get("Authorization");

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch (e: any) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 422 });
    }

    const currentUser = await getAuthenticatedUser(authorization);

    try {
      const expiresAt = Date.now() + 60 * 1000;

      const urlData: {
        original: string;
        expiresAt: number;
        owner_id?: string;
      } = {
        original: url,
        expiresAt: expiresAt,
        ...(currentUser && { owner_id: currentUser.uid }),
      };

      const createdDoc = await db.collection("urls").add(urlData);
      const newShortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${createdDoc.id}`;

      return NextResponse.json(
        { shortenedUrl: newShortenedUrl },
        { status: 200 }
      );
    } catch (dbError: any) {
      console.error("Error creating Firestore document: ", dbError);
      return NextResponse.json(
        { error: "Failed to save URL" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error shortening URL: ", error);
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
}
