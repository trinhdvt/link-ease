import type { User } from "@/features/user/types";
import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { serverConfig } from "./config";
import { authAdmin } from "./firebaseAdmin";

/**
 * Retrieves and verifies the authentication token from the session cookie.
 *
 * This function fetches the session cookie from the cookie store and attempts
 * to verify it using the `authAdmin.verifySessionCookie` method. If the session
 * cookie is valid, the decoded token is returned. If the cookie is invalid or
 * an error occurs during verification, the error is logged, and the function
 * returns `undefined`.
 *
 * @returns {Promise<DecodedIdToken | undefined>} A promise that resolves to the decoded
 * authentication token if the session cookie is valid, or `undefined` if the
 * cookie is invalid or an error occurs.
 */
export const getAuthToken = async (): Promise<DecodedIdToken | undefined> => {
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get(serverConfig.authCookieName)?.value ?? "";

  if (sessionCookie) {
    try {
      return await authAdmin.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      console.error("Error decoding session cookie:", error);
    }
  }
};

/**
 * Retrieves the current authenticated user based on the decoded authentication token.
 *
 * @returns A promise that resolves to a `User` object containing the user's details
 *          (id, displayName, email, photoURL) if the token is valid, or `undefined` if not.
 */
export const getCurrentUser = async () => {
  const decodedToken = await getAuthToken();

  let user: User | undefined = undefined;
  if (decodedToken) {
    user = {
      id: decodedToken.user_id,
      displayName: decodedToken.name,
      email: decodedToken.email,
      photoURL: decodedToken.picture,
    };
  }

  return user;
};
