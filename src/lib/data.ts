import { dbAdmin as db } from "@/lib/firebaseAdmin";

export interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiresAt: string;
  clicks: number;
}

export async function getUserUrls(userId: string): Promise<UrlData[]> {
  if (!userId) {
    return [];
  }

  try {
    const urlsSnapshot = await db
      .collection("urls")
      .where("ownerId", "==", userId)
      .get();

    if (urlsSnapshot.empty) {
      return [];
    }

    const urls: UrlData[] = [];
    for (const doc of urlsSnapshot.docs) {
      const data = doc.data();

      let totalClicks = 0;
      if (
        data.dailyAccessCounts &&
        typeof data.dailyAccessCounts === "object"
      ) {
        totalClicks = Object.values<number>(data.dailyAccessCounts).reduce(
          (sum: number, count: number) => sum + count,
          0,
        );
      }

      urls.push({
        id: doc.id,
        originalUrl: data.original,
        shortCode: doc.id,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString()
          : new Date().toISOString(),
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : new Date(Date.now() + 60000 * 60 * 24 * 30).toISOString(),
        clicks: totalClicks,
      });
    }

    return urls;
  } catch (error) {
    console.error("Error fetching user URLs from Firestore:", error);
    return [];
  }
}
