import { dbAdmin as db } from "@/lib/firebaseAdmin";
import type { DocumentData, QuerySnapshot } from "firebase-admin/firestore";

/**
 * Validates basic authentication credentials
 * @param request The incoming request
 * @returns Boolean indicating if authentication is valid
 */
export async function authenticateInternalRequest(
  request: Request,
): Promise<boolean> {
  // Get authorization header
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  // Get credentials from header
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
  const [username, password] = credentials.split(":");

  // Compare with environment variables
  const expectedUsername = process.env.INTERNAL_API_USERNAME;
  const expectedPassword = process.env.INTERNAL_API_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error("Authentication environment variables not properly set");
    return false;
  }

  return username === expectedUsername && password === expectedPassword;
}

/**
 * Cleans up rate limit documents from Firestore that are older than the current day.
 * This function assumes that rateLimit documents have a field named 'dateString'
 * in 'YYYY-MM-DD' format.
 *
 * @returns A promise that resolves with the count of deleted documents and batches committed.
 */
export const cleanupOldRateLimits = async (
  referenceDate?: Date,
): Promise<{
  deletedCount: number;
  batchesCommitted: number;
  success: boolean;
  error?: string;
}> => {
  const today = referenceDate || new Date();
  const todayDateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format

  console.log(
    `Starting cleanup of rate limit documents older than ${todayDateString}.`,
  );

  let querySnapshot: QuerySnapshot<DocumentData>;
  try {
    querySnapshot = await db
      .collection("rateLimits")
      .where("dateString", "<", todayDateString)
      .get();
  } catch (error) {
    console.error("Error querying old rate limit documents:", error);
    throw error;
  }

  if (querySnapshot.empty) {
    console.log("No old rate limit documents to delete.");
    return { deletedCount: 0, batchesCommitted: 0, success: true };
  }

  // Firestore allows up to 500 operations in a batch.
  const BATCH_SIZE = 499;
  let batch = db.batch();
  let deletedCount = 0;
  let operationsInBatch = 0;
  let batchesCommitted = 0;

  console.log(`Found ${querySnapshot.size} documents to delete.`);

  for (const doc of querySnapshot.docs) {
    batch.delete(doc.ref);
    operationsInBatch++;
    deletedCount++;

    if (operationsInBatch >= BATCH_SIZE) {
      try {
        await batch.commit();
        batchesCommitted++;
      } catch (error) {
        console.error("Error committing batch:", error);
      }
      batch = db.batch(); // Start a new batch
      operationsInBatch = 0;
    }
  }

  if (operationsInBatch > 0) {
    try {
      await batch.commit();
      batchesCommitted++;
    } catch (error) {
      console.error("Error committing final batch:", error);
    }
  }

  console.log(
    `Cleanup finished. Deleted ${deletedCount} documents in ${batchesCommitted} batches.`,
  );
  return { deletedCount, batchesCommitted, success: true };
};
