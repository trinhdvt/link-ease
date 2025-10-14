import { render, screen } from "@testing-library/react";
import React from "react";
import { vi, describe, test, it, beforeEach } from "vitest";
import Header from "@/components/header/header";

vi.mock("@/features/auth/components/sign-in-with-google", () => {
  return {
    default: function MockSignInWithGoogle() {
      return <button type="button">Sign in with Google</button>;
    },
  };
});

vi.mock("@/features/user/components/user-profile", () => {
  return {
    default: function MockUserProfile() {
      return (
        <div>
          <span>Mocked User Profile</span>
        </div>
      );
    },
  };
});

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders sign in button when user is not authenticated", () => {
    render(<Header />);
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  test("renders user profile component when authenticated", async () => {
    const mockUser = {
      displayName: "Test User",
      email: "test@example.com",
      photoURL: "https://example.com/photo.jpg",
      id: "12345",
    };

    render(<Header user={mockUser} />);
    expect(screen.getByText("Mocked User Profile")).toBeInTheDocument();
  });

  it("renders ThemeToggle component", () => {
    render(<Header />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });
});
