"use server";

import { getCurrentUser } from "@/lib/auth";
import { dbAdmin } from "@/lib/firebaseAdmin";

export const deleteUrl = async (shortCode: string) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Not authenticated" };
  }

  const docRef = dbAdmin.collection("urls").doc(shortCode);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return { success: false, error: "URL not found" };
  }

  const data = docSnap.data();
  if (!data?.ownerId || data.ownerId !== currentUser.id) {
    return { success: false, error: "URL not found" };
  }

  try {
    await dbAdmin.recursiveDelete(docRef);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
