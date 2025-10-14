import { vi, describe, it, afterEach, expect } from "vitest";
import type { UrlData } from "@/lib/data";
import { fireEvent, render, screen } from "@testing-library/react";
import UrlDashboard from "./url-dashboard";

vi.mock("./url-table", () => {
  return {
    default: function UrlTable({ urls }: { urls: UrlData[] }) {
      return (
        <div data-testid="url-table">
          {urls.map((u) => u.shortCode).join(",")}
        </div>
      );
    },
  };
});

describe("UrlDashboard", () => {
  const now = Date.now();
  const urls: UrlData[] = [
    {
      id: "1",
      originalUrl: "https://a.com",
      shortCode: "a1",
      createdAt: new Date(now - 100000).toISOString(),
      expiresAt: new Date(now + 100000).toISOString(),
      clicks: 5,
    },
    {
      id: "2",
      originalUrl: "https://b.com",
      shortCode: "b2",
      createdAt: new Date(now - 200000).toISOString(),
      expiresAt: new Date(now - 1000).toISOString(), // expired
      clicks: 10,
    },
    {
      id: "3",
      originalUrl: "https://c.com",
      shortCode: "c3",
      createdAt: new Date(now - 300000).toISOString(),
      expiresAt: new Date(now + 200000).toISOString(),
      clicks: 1,
    },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders search, tabs, sort, and UrlTable", () => {
    render(<UrlDashboard urls={urls} />);
    expect(screen.getByPlaceholderText(/search urls/i)).toBeDefined();
    expect(screen.getByText(/All/)).toBeDefined();
    expect(screen.getByText(/Active/)).toBeDefined();
    expect(screen.getByText(/Expired/)).toBeDefined();
    expect(screen.getByText(/Newest first/)).toBeDefined();
    expect(screen.getByTestId("url-table")).toBeDefined();
  });

  it("filters by search input", () => {
    render(<UrlDashboard urls={urls} />);
    fireEvent.change(screen.getByPlaceholderText(/search urls/i), {
      target: { value: "b.com" },
    });
    expect(screen.getByTestId("url-table").textContent).toBe("b2");
  });

  it("filters by status: active", async () => {
    render(<UrlDashboard urls={urls} />);
    fireEvent.mouseDown(screen.getByText(/Active/));

    const urlTable = screen.getByTestId("url-table");

    expect(urlTable).toHaveProperty("textContent", "a1,c3");
    expect(urlTable).not.toHaveProperty("textContent", "b2");
  });

  it("filters by status: expired", () => {
    render(<UrlDashboard urls={urls} />);
    fireEvent.mouseDown(screen.getByText(/Expired/));
    expect(screen.getByTestId("url-table").textContent).toBe("b2");
  });

  it("sorts by clicks descending", () => {
    render(<UrlDashboard urls={urls} />);
    fireEvent.click(screen.getByText(/Newest first/));
    fireEvent.click(screen.getByText(/Most clicks/));
    expect(screen.getByTestId("url-table").textContent).toBe("b2,a1,c3");
  });

  it("sorts by original URL A-Z", () => {
    render(<UrlDashboard urls={urls} />);
    fireEvent.click(screen.getByText(/Newest first/));
    fireEvent.click(screen.getByText(/Original URL \(A-Z\)/));
    expect(screen.getByTestId("url-table").textContent).toBe("a1,b2,c3");
  });
});
