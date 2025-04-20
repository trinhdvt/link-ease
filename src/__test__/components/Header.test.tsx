import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "@/components/Header";
import { User } from "firebase/auth";

jest.mock("@/lib/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => {
  return {
    GoogleAuthProvider: jest.fn(() => ({})),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(
      (_auth: any, callback: (user: User | null) => void) => {
        callback(null);
        return () => {};
      }
    ),
  };
});

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders sign in button when user is not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  test("calls signInWithPopup when sign in button is clicked", async () => {
    const { GoogleAuthProvider, signInWithPopup } = require("firebase/auth");
    render(<Header />);

    const signInButton = screen.getByText("Sign in with Google");
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(GoogleAuthProvider).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });
  });

  test("renders user info and sign out button when authenticated", async () => {
    const mockUser = {
      displayName: "Test User",
      email: "test@example.com",
      photoURL: "https://example.com/photo.jpg",
      uid: "123",
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: "",
      tenantId: null,
      delete: jest.fn(),
      getIdToken: jest.fn().mockResolvedValue("mock-token"),
      getIdTokenResult: jest.fn(),
      reload: jest.fn(),
      toJSON: jest.fn(),
    } as unknown as User;

    const { onAuthStateChanged, signOut } = require("firebase/auth");
    onAuthStateChanged.mockImplementation(
      (_auth: any, callback: (user: User | null) => void) => {
        callback(mockUser);
        return () => {};
      }
    );

    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);

    expect(signOut).toHaveBeenCalled();
  });
});
