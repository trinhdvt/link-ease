import { dbAdmin } from "@/lib/firebaseAdmin";
import type { DocumentData } from "firebase-admin/firestore";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    shortCode: string;
  }>;
}

export async function GET(req: Request, { params }: Params) {
  const { shortCode } = await params;

  let docSnap: DocumentSnapshot<DocumentData>;
  const shortCodeRef = dbAdmin.collection("urls").doc(shortCode);

  try {
    docSnap = await shortCodeRef.get();
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.redirect("/500");
  }

  if (docSnap.exists) {
    const data = docSnap.data();
    const now = Date.now();
    if (data?.expiresAt && data.expiresAt > now) {
      const date = new Date(now).toISOString().split("T")[0];
      const userAgent = req.headers.get("user-agent") || "unknown";
      const referrer = req.headers.get("referer") || "direct";

      const logData = {
        timestamp: now,
        date: date,
        userAgent: userAgent,
        referrer: referrer,
      };

      shortCodeRef.collection("accessLogs").add(logData).catch(console.error);
      shortCodeRef
        .update({
          [`dailyAccessCounts.${date}`]: FieldValue.increment(1),
        })
        .catch(console.error);

      return NextResponse.redirect(data?.original);
    }
  }

  return notFound();
}
