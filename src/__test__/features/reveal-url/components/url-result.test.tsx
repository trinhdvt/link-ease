import UrlResult from "@/features/reveal-url/components/url-result";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { jest } from "@jest/globals";

describe("UrlResult", () => {
  const mockProps = {
    originalUrl:
      "https://www.example.com/very/long/url/that/needs/to/be/truncated/for/display/purposes",
    shortCode: "abc123",
  };

  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("renders with provided props", () => {
    render(<UrlResult {...mockProps} />);

    expect(screen.getByText(/Original URL Found/i)).toBeInTheDocument();
    expect(screen.getByText(mockProps.shortCode)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /www\.example\.com.*\.\.\.$/i }),
    ).toBeInTheDocument();
  });

  it("truncates long URLs correctly", () => {
    render(<UrlResult {...mockProps} />);

    const link = screen.getByRole("link", {
      name: /www\.example\.com.*\.\.\.$/i,
    });
    expect(link.textContent?.length).toBeLessThan(mockProps.originalUrl.length);
    expect(link.textContent?.endsWith("...")).toBe(true);
  });

  it("shows short URLs without truncation", () => {
    const shortUrlProps = {
      originalUrl: "https://example.com",
      shortCode: "abc123",
    };

    render(<UrlResult {...shortUrlProps} />);

    const link = screen.getByRole("link", { name: /example\.com/i });
    expect(link.textContent).toBe(shortUrlProps.originalUrl);
  });

  it("copies URL to clipboard and shows confirmation", async () => {
    render(<UrlResult {...mockProps} />);

    const copyButton = screen.getByRole("button", { name: /copy url/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockProps.originalUrl,
    );
    expect(screen.getByText(/copied/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.queryByText(/copied/i)).not.toBeInTheDocument();
    expect(screen.getByText(/copy url/i)).toBeInTheDocument();
  });

  it("renders external links with correct attributes", () => {
    render(<UrlResult {...mockProps} />);

    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
