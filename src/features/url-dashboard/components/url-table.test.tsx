import { vi, describe, it, afterEach, expect } from "vitest";
import type { UrlData } from "@/lib/data";
import { act, fireEvent, render, screen } from "@testing-library/react";
import UrlTable from "./url-table";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  BarChart2: () => <svg data-testid="icon-analytics" />,
  Check: () => <svg data-testid="icon-check" />,
  ChevronLeft: () => <svg data-testid="icon-left" />,
  ChevronRight: () => <svg data-testid="icon-right" />,
  Copy: () => <svg data-testid="icon-copy" />,
  ExternalLink: () => <svg data-testid="icon-external" />,
  Trash2: () => <svg data-testid="icon-trash" />,
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

const baseUrl = "https://test.com";

vi.mock("@/lib/config", () => ({
  clientConfig: { baseUrl: "https://test.com", domain: "test.com" },
}));

vi.mock("@/features/url-dashboard/actions/delete-url", () => ({
  deleteUrl: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    refresh: vi.fn(),
  }),
}));

describe("UrlTable", () => {
  const urls: UrlData[] = [
    {
      id: "1",
      originalUrl:
        "https://verylongurl.com/with/a/lot/of/segments/and/parameters/that/should/be/truncated/for/display",
      shortCode: "abc123",
      createdAt: new Date(Date.now() - 2000000).toISOString(),
      expiresAt: new Date(Date.now() + 1000000).toISOString(),
      clicks: 42,
    },
    {
      id: "2",
      originalUrl: "https://expired.com",
      shortCode: "exp456",
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      expiresAt: new Date(Date.now() - 1000000).toISOString(),
      clicks: 0,
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders empty state", () => {
    render(<UrlTable urls={[]} />);
    expect(screen.getByText(/No URLs found/i)).toBeDefined();
    expect(
      screen.getByRole("link", { name: /Create New URL/i }),
    ).toBeDefined();
  });

  it("renders table rows for each url", () => {
    render(<UrlTable urls={urls} />);
    expect(screen.getByText(/verylongurl.com/)).toBeDefined();
    expect(screen.getByText(/expired.com/)).toBeDefined();
    expect(screen.getAllByTestId("icon-external")).toHaveLength(2);
    expect(screen.getAllByTestId("icon-copy")).toHaveLength(2);
    expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
  });

  it("truncates long URLs", () => {
    render(<UrlTable urls={urls} />);
    expect(screen.getByText(/verylongurl.com.*\.\.\./i)).toBeDefined();
  });

  it("copies shortened URL to clipboard and shows check icon", async () => {
    vi.useFakeTimers();
    render(<UrlTable urls={urls} />);
    const copyButtons = screen.getAllByRole("button", { name: "" });
    // Copy button is the second button in the first row
    await act(async () => {
      fireEvent.click(copyButtons[1]);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${baseUrl}/exp456`,
    );
    expect(screen.getByTestId("icon-check")).toBeDefined();
    // After timeout, icon disappears
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.queryByTestId("icon-check")).toBeNull();
  });

  it("shows pagination controls if more than 10 urls", () => {
    const manyUrls = Array.from({ length: 15 }, (_, i) => ({
      ...urls[0],
      id: String(i),
      shortCode: `code${i}`,
      originalUrl: `https://site${i}.com`,
      createdAt: new Date(Date.now() - 4000000 - i * 1000).toISOString(),
    }));
    render(<UrlTable urls={manyUrls} />);
    expect(screen.getByText(/Page 1 of 2/)).toBeDefined();
    expect(screen.getByTestId("icon-right")).toBeDefined();
    // Click next page
    fireEvent.click(screen.getByTestId("icon-right"));
    expect(screen.getByText(/Page 2 of 2/)).toBeDefined();
    expect(screen.getByTestId("icon-left")).toBeDefined();
  });

  it("renders analytics and delete buttons", () => {
    render(<UrlTable urls={urls} />);
    expect(screen.getAllByTestId("icon-analytics")).toHaveLength(2);
    expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
  });
});
