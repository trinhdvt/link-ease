import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignInWithGoogle from "./sign-in-with-google";

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
}));

global.fetch = jest.fn();

describe(SignInWithGoogle, () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test("calls signInWithPopup when sign in button is clicked", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
    });
    const { GoogleAuthProvider, signInWithPopup } = require("firebase/auth");
    render(<SignInWithGoogle />);

    const signInButton = screen.getByText("Sign in with Google");
    fireEvent.click(signInButton);

    // Button should be disabled and show loading text
    expect(signInButton.closest("button")).toBeDisabled();
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");

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

  test("shows spinner and disables button while loading", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    render(<SignInWithGoogle />);
    const signInButton = screen.getByText("Sign in with Google");
    fireEvent.click(signInButton);
    // Spinner should be present
    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    // Spinner is a span with animate-spin class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    });
  });
});
