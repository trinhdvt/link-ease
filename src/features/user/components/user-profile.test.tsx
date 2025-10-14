import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, beforeAll, expect } from "vitest";
import type { User } from "../types";
import UserProfile from "./user-profile";

global.fetch = vi.fn();

describe(UserProfile, () => {
  const mockUser: User = {
    id: "123",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "http://example.com/photo.jpg",
  };

  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("user menu trigger", () => {
    it("renders display name when available", () => {
      render(<UserProfile user={mockUser} />);
      const displayName = screen.getByText(mockUser.displayName);
      expect(displayName).toBeInTheDocument();
    });

    it("renders email when display name is not available", () => {
      const userWithoutDisplayName = { ...mockUser, displayName: "" };
      render(<UserProfile user={userWithoutDisplayName} />);
      const email = screen.getByText(mockUser.email || "");
      expect(email).toBeInTheDocument();
    });
  });

  describe("user menu actions", () => {
    function triggerDropdown() {
      const dropdownTrigger = screen.getByTestId("user-profile-trigger");

      fireEvent.keyDown(dropdownTrigger, {
        key: "Enter",
      });
    }

    it("renders dashboard link", async () => {
      render(<UserProfile user={mockUser} />);
      triggerDropdown();
      const dashboardLink = await screen.findByText("Dashboard");
      expect(dashboardLink).toBeInTheDocument();
    });

    it("renders sign out button", async () => {
      render(<UserProfile user={mockUser} />);
      triggerDropdown();

      const signOutButton = await screen.findByText("Sign out");
      expect(signOutButton).toBeInTheDocument();

      fireEvent.click(signOutButton);
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/logout", {
          method: "POST",
          credentials: "include",
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
  });
});
