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
});
