import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { vi, describe, test, beforeEach, expect, type Mock } from "vitest";
import Home from "@/app/page";
import { useToast } from "@/hooks/use-toast";

vi.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

global.fetch = vi.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe("Home Page", () => {
  let mockToast: Mock;

  beforeEach(() => {
    mockToast = vi.fn();
    (useToast as Mock).mockReturnValue({ toast: mockToast });
    (global.fetch as Mock).mockClear();
    (navigator.clipboard.writeText as Mock).mockClear();
  });

  test("renders initial state correctly", () => {
    render(<Home />);

    expect(
      screen.getByText("LinkEase - Shorten Your URLs"),
    ).toBeDefined();
    expect(
      screen.getByPlaceholderText(/Paste your URL here/i),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: /Shorten/i }),
    ).toBeDefined();
    expect(screen.queryByRole("link")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /copy/i }),
    ).toBeNull();
  });

  test("handles successful URL shortening", async () => {
    const mockShortenedUrl = "http://localhost:3000/short123";
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shortenedUrl: mockShortenedUrl }),
    });

    render(<Home />);

    const input = screen.getByPlaceholderText(/Paste your URL here/i);
    const shortenButton = screen.getByRole("button", { name: /Shorten/i });
    const testUrl = "https://example.com/very/long/url";

    fireEvent.change(input, { target: { value: testUrl } });
    fireEvent.click(shortenButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testUrl }),
        credentials: "include",
      });
    });

    await waitFor(() => {
      const shortenedLink = screen.getByRole("link", {
        name: mockShortenedUrl,
      });
      expect(shortenedLink).toBeDefined();
      expect(shortenedLink).toHaveProperty("href", mockShortenedUrl);
      expect(screen.getByRole("button", { name: /copy/i })).toBeDefined();
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "URL Shortened!",
      description: "The URL has been shortened successfully.",
    });
  });

  test("input invalid URL", async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/Paste your URL here/i);
    const shortenButton = screen.getByRole("button", { name: /Shorten/i });
    const testUrl = "invalid-url";

    act(() => {
      fireEvent.change(input, { target: { value: testUrl } });
    });
    expect(shortenButton).toHaveProperty("disabled", false);
    fireEvent.click(shortenButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  test("handles copy button click", async () => {
    const mockShortenedUrl = "http://localhost:3000/short456";
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shortenedUrl: mockShortenedUrl }),
    });

    render(<Home />);

    const input = screen.getByPlaceholderText("Paste your URL here");
    const shortenButton = screen.getByRole("button", { name: /Shorten/i });

    fireEvent.change(input, {
      target: { value: "https://another-example.com" },
    });

    // Check the form can be submitted
    fireEvent.click(shortenButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText(/Shortening/i)).toBeDefined();
      expect(
        screen.getByRole("button", { name: /Shortening/i }),
      ).toHaveProperty("disabled", true);
    });

    // Wait for API response
    await waitFor(() => {
      expect(screen.queryByText("Shortening")).toBeNull();
      expect(screen.getByText("Shorten")).toBeDefined();
    });

    const copyButton = await screen.findByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockShortenedUrl,
    );

    expect(mockToast).toHaveBeenCalledWith({
      description: "Shortened URL copied to clipboard",
    });
  });
});
