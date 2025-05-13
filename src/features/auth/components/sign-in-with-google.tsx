"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInWithGoogle() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      className="flex items-center space-x-2"
      disabled={loading}
      aria-busy={loading}
      aria-label={loading ? "Signing in with Google" : "Sign in with Google"}
      tabIndex={0}
    >
      {loading ? (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-gray-500 rounded-full" />
      ) : null}
      <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
    </Button>
  );
}
