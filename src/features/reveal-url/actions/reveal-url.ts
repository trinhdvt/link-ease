"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";

export async function revealUrl(shortCode: string) {
  const docRef = dbAdmin.collection("urls").doc(shortCode);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    const data = docSnap.data();
    const now = Date.now();
    if (data?.expiresAt && data.expiresAt > now) {
      return {
        originalUrl: data?.original,
        shortCode,
      };
    }
  }

  return {
    error: "This shortened URL was not found in our system.",
    shortCode,
  };
}
