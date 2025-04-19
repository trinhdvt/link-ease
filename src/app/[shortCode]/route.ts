import { urlsCollection } from '@/lib/firestore';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{
    shortCode: string
  }>
}

export async function GET(_: Request, { params }: Params) {
  const { shortCode } = await params;

  try {
    const docRef = urlsCollection.doc(shortCode);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      return NextResponse.redirect(data?.original);
    } else {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
