import { dbAdmin } from "@/lib/firebaseAdmin";
import type { DocumentData } from "firebase-admin/firestore";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    shortCode: string;
  }>;
}

export async function GET(_: Request, { params }: Params) {
  const { shortCode } = await params;

  let docSnap: DocumentSnapshot<DocumentData>;
  try {
    const docRef = dbAdmin.collection("urls").doc(shortCode);
    docSnap = await docRef.get();
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.redirect("/500");
  }

  if (docSnap.exists) {
    const data = docSnap.data();
    if (data?.expiresAt && data.expiresAt > Date.now()) {
      return NextResponse.redirect(data?.original);
    }
  }

  return notFound();
}
