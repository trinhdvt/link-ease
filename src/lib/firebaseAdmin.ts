import { cert, getApps, initializeApp } from "firebase-admin/app";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  const base64ServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;

  if (!base64ServiceAccount) {
    throw new Error("Missing Firebase Admin env");
  }

  const serviceAccount = base64ServiceAccount
    ? JSON.parse(Buffer.from(base64ServiceAccount, "base64").toString("utf8"))
    : {};

  try {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: any) {
    console.error("Firebase Admin SDK initialization error:", error.message);
  }
}

export const authAdmin = getAuth();
export const dbAdmin = getFirestore();

/**
 * Verifies a Firebase ID token from the Authorization header.
 * @param authorizationHeader The value of the Authorization header (e.g., "Bearer <token>")
 * @returns The decoded token if valid, null otherwise
 */
export async function getAuthenticatedUser(
  authorizationHeader: string | null,
): Promise<DecodedIdToken | null> {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authorizationHeader.split("Bearer ")[1];
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.warn("Invalid or expired auth token received:", error);
    return null;
  }
}
