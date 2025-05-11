"use server";

import { dbAdmin } from "@/lib/firebaseAdmin";
import {
  type DocumentData,
  type DocumentSnapshot,
  FieldValue,
} from "firebase-admin/firestore";

/**
 * Retrieves the original URL associated with a given short code from the database.
 *
 * If the short code exists and has not expired, this function optionally logs access details
 * (such as user agent and referrer) and increments the daily access count for analytics.
 *
 * @param shortCode - The unique identifier for the shortened URL.
 * @param headers - Optional HTTP headers containing user-agent and referer information for logging.
 * @returns A promise that resolves to the original URL string if found and valid, or `null` if not found or expired.
 */
export async function getOriginalUrl(
  shortCode: string,
  headers?: Headers,
): Promise<string | null> {
  let docSnap: DocumentSnapshot<DocumentData>;
  const shortCodeRef = dbAdmin.collection("urls").doc(shortCode);

  try {
    docSnap = await shortCodeRef.get();
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }

  if (!docSnap.exists) return null;

  const data = docSnap.data();
  const now = Date.now();

  if (!data?.expiresAt || data.expiresAt < now) return null;

  const date = new Date(now).toISOString().split("T")[0];
  if (headers) {
    const userAgent = headers?.get("user-agent") || "unknown";
    const referrer = headers?.get("referer") || "direct";

    const logData = {
      timestamp: now,
      date: date,
      userAgent: userAgent,
      referrer: referrer,
    };

    shortCodeRef.collection("accessLogs").add(logData).catch(console.error);
  }
  shortCodeRef
    .update({
      [`dailyAccessCounts.${date}`]: FieldValue.increment(1),
    })
    .catch(console.error);

  return data?.original;
}
