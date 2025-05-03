"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignInWithGoogle() {
  const router = useRouter();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }
      router.refresh();
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      className="flex items-center space-x-2"
    >
      <span>Sign in with Google</span>
    </Button>
  );
}
