import { NextResponse } from 'next/server';
import { db } from '@/lib/firestore';


export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      new URL(url)
    } catch (e: any) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
      const expiresAt = Date.now() + 60 * 1000; // 1 minute expiration
      const createdDoc = await db.collection("urls").add({
        original: url,
        expiresAt: expiresAt,
      });
      const newShortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${createdDoc.id}`;

      return NextResponse.json({ shortenedUrl: newShortenedUrl }, { status: 200 });
    } catch (error: any) {
      console.error('Error verifying token: ', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
  } catch (error) {
    console.error('Error shortening URL: ', error);
    return NextResponse.json({ error: 'Failed to shorten URL' }, { status: 500 });
  }
}
