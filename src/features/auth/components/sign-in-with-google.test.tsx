import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, test, beforeAll, expect, type Mock } from "vitest";
import SignInWithGoogle from "./sign-in-with-google";

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

const { mockGoogleAuthProvider, mockSignInWithPopup } = vi.hoisted(() => {
  return {
    mockGoogleAuthProvider: vi.fn(() => ({})),
    mockSignInWithPopup: vi.fn(() =>
      Promise.resolve({
        user: { getIdToken: vi.fn(() => Promise.resolve("mock-token")) },
      }),
    ),
  };
});

vi.mock("firebase/auth", () => {
  return {
    GoogleAuthProvider: mockGoogleAuthProvider,
    signInWithPopup: mockSignInWithPopup,
  };
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}));

global.fetch = vi.fn();

describe(SignInWithGoogle, () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  test("calls signInWithPopup when sign in button is clicked", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
    });
    render(<SignInWithGoogle />);

    const signInButton = screen.getByText("Sign in with Google");
    fireEvent.click(signInButton);

    // Button should be disabled and show loading text
    expect(signInButton.closest("button")).toHaveProperty("disabled", true);
    expect(screen.getByText("Signing in...")).toBeDefined();
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");

    await waitFor(() => {
      expect(mockGoogleAuthProvider).toHaveBeenCalledTimes(1);
      expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: "mock-token" }),
      });
    });
  });

  test("shows spinner and disables button while loading", async () => {
    (global.fetch as Mock).mockResolvedValue({ ok: true });
    render(<SignInWithGoogle />);
    const signInButton = screen.getByText("Sign in with Google");
    fireEvent.click(signInButton);
    // Spinner should be present
    expect(screen.getByText("Signing in...")).toBeDefined();
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
    // Spinner is a span with animate-spin class
    expect(document.querySelector(".animate-spin")).toBeDefined();
    await waitFor(() => {
      expect(screen.getByText("Sign in with Google")).toBeDefined();
    });
  });
});
