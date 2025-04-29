import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "@/components/Header";

jest.mock("@/lib/firebase", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => {
  return {
    GoogleAuthProvider: jest.fn(() => ({})),
    signInWithPopup: jest.fn(() =>
      Promise.resolve({
        user: { getIdToken: jest.fn(() => Promise.resolve("mock-token")) },
      }),
    ),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    refresh: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
}));

global.fetch = jest.fn();

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders sign in button when user is not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  test("calls signInWithPopup when sign in button is clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });
    const { GoogleAuthProvider, signInWithPopup } = require("firebase/auth");
    render(<Header />);

    const signInButton = screen.getByText("Sign in with Google");
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(GoogleAuthProvider).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: "mock-token" }),
      });
    });
  });

  test("renders user info and sign out button when authenticated", async () => {
    const mockUser = {
      displayName: "Test User",
      email: "test@example.com",
      photoURL: "https://example.com/photo.jpg",
      id: "12345",
    };

    render(<Header user={mockUser} />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });

    const signOutButton = screen.getByText("Sign Out");
    fireEvent.click(signOutButton);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    });
  });
});
