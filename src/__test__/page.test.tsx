import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";
import { useToast } from "@/hooks/use-toast";

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

  test("handles API error during URL shortening", async () => {
    const errorMessage = "Invalid URL provided";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMessage }),
    });

    render(<Home />);

    const input = screen.getByPlaceholderText(/Paste your URL here/i);
    const shortenButton = screen.getByRole("button", { name: /Shorten/i });
    const testUrl = "invalid-url";

    fireEvent.change(input, { target: { value: testUrl } });
    fireEvent.click(shortenButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(mockToast).toHaveBeenCalledWith({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /copy/i })
    ).not.toBeInTheDocument();
  });

  test("handles copy button click", async () => {
    const mockShortenedUrl = "http://localhost:3000/short456";
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ shortenedUrl: mockShortenedUrl }),
    });

    render(<Home />);

    const input = screen.getByPlaceholderText(/Paste your URL here/i);
    const shortenButton = screen.getByRole("button", { name: /Shorten/i });

    fireEvent.change(input, {
      target: { value: "https://another-example.com" },
    });
    fireEvent.click(shortenButton);

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
