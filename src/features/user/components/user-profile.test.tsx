import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { User } from "../types";
import UserProfile from "./user-profile";

global.fetch = jest.fn();

describe(UserProfile, () => {
  const mockUser: User = {
    id: "123",
    displayName: "John Doe",
    email: "john.doe@example.com",
    photoURL: "http://example.com/photo.jpg",
  };

  beforeAll(() => {
    jest.clearAllMocks();
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
    it("renders sign out button", async () => {
      render(<UserProfile user={mockUser} />);
      const dropdownTrigger = screen.getByTestId("user-profile-trigger");

      fireEvent.keyDown(dropdownTrigger, {
        key: "Enter",
      });

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
