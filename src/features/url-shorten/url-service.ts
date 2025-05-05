import { dbAdmin } from "@/lib/firebaseAdmin";
import type { Url } from "./types";

/**
 * Removes all expired URLs from the 'urls' collection
 * @returns Object containing success status and deleted URLs information
 */
export async function removeExpiredUrls(): Promise<{
  success: boolean;
  message: string;
  deletedCount: number;
  deletedUrls?: Url[];
  error?: string;
}> {
  try {
    const now = Date.now();

    const expiredUrlsQuery = dbAdmin
      .collection("urls")
      .where("expiresAt", "<", now);

    const expiredUrlsSnapshot = await expiredUrlsQuery.get();

    if (expiredUrlsSnapshot.empty) {
      console.log("No expired URLs found");
      return {
        success: true,
        message: "No expired URLs found",
        deletedCount: 0,
      };
    }

    const urlsToDelete: Url[] = expiredUrlsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        original: data.original,
        expiresAt: data.expiresAt,
      };
    });

    console.log(
      `Found ${urlsToDelete.length} expired URLs to delete:`,
      JSON.stringify(urlsToDelete, null, 2),
    );

    // Create a batch to perform multiple deletions efficiently
    const batch = dbAdmin.batch();

    // Add each expired document to the batch for deletion
    for (const doc of expiredUrlsSnapshot.docs) {
      batch.delete(doc.ref);
    }

    // Commit the batch operation
    await batch.commit();

    console.log(`Successfully deleted ${urlsToDelete.length} expired URLs`);
    return {
      success: true,
      message: `Successfully deleted ${urlsToDelete.length} expired URLs`,
      deletedCount: urlsToDelete.length,
      deletedUrls: urlsToDelete,
    };
  } catch (error) {
    console.error("Error cleaning up expired URLs:", error);
    return {
      success: false,
      message: "Failed to clean up expired URLs",
      deletedCount: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
