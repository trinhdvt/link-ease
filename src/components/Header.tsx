"use client";

import React, { useState, useEffect } from "react";

import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {loading ? (
        <span>Loading...</span>
      ) : user ? (
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
            onClick={handleSignOut}
            style={{ padding: "8px 12px", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          style={{ padding: "8px 12px", cursor: "pointer" }}
        >
          Sign in with Google
        </button>
      )}
    </header>
  );
};

export default Header;
