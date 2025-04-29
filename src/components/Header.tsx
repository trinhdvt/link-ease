"use client";

import type React from "react";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Navigation from "./Navigation";

interface HeaderProps {
  user?: {
    displayName: string;
    email?: string;
    photoURL?: string;
  };
}

const Header: React.FC<HeaderProps> = ({ user }) => {
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

  const handleSignOut = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      router.refresh();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Navigation />
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || "User profile"}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            )}
            <span>{user.displayName || user.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              style={{ padding: "8px 12px", cursor: "pointer" }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
