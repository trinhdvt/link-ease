import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";
import { useToast } from "@/hooks/use-toast";

jest.mock("@/lib/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

global.fetch = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

describe("Home Page", () => {
  let mockToast: jest.Mock;

  beforeEach(() => {
    mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (global.fetch as jest.Mock).mockClear();
    (navigator.clipboard.writeText as jest.Mock).mockClear();
  });

  test("renders initial state correctly", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /LinkEase - Shorten Your URLs/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Paste your URL here/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Shorten/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /copy/i })
    ).not.toBeInTheDocument();
  });

  test("handles successful URL shortening", async () => {
    const mockShortenedUrl = "http://localhost:3000/short123";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
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
      expect(shortenedLink).toBeInTheDocument();
      expect(shortenedLink).toHaveAttribute("href", mockShortenedUrl);
      expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
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
    expect(shortenButton).not.toBeDisabled();
    fireEvent.click(shortenButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  test("handles copy button click", async () => {
    const mockShortenedUrl = "http://localhost:3000/short456";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
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
      expect(screen.getByText(/Shortening/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Shortening/i })
      ).toBeDisabled();
    });

    // Wait for API response
    await waitFor(() => {
      expect(screen.queryByText("Shortening")).not.toBeInTheDocument();
      expect(screen.getByText("Shorten")).toBeInTheDocument();
    });

    const copyButton = await screen.findByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockShortenedUrl
    );

    expect(mockToast).toHaveBeenCalledWith({
      description: "Shortened URL copied to clipboard",
    });
  });
});
