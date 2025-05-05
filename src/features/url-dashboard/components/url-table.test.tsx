import type { UrlData } from "@/lib/data";
import { act, fireEvent, render, screen } from "@testing-library/react";
import UrlTable from "./url-table";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
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
    writeText: jest.fn(),
  },
});

const baseUrl = "https://test.com";

jest.mock("@/lib/config", () => ({
  clientConfig: { baseUrl: "https://test.com", domain: "test.com" },
}));

jest.mock("@/features/url-dashboard/actions/delete-url", () => ({
  deleteUrl: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    refresh: jest.fn(),
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
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders empty state", () => {
    render(<UrlTable urls={[]} />);
    expect(screen.getByText(/No URLs found/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Create New URL/i }),
    ).toBeInTheDocument();
  });

  it("renders table rows for each url", () => {
    render(<UrlTable urls={urls} />);
    expect(screen.getByText(/verylongurl.com/)).toBeInTheDocument();
    expect(screen.getByText(/expired.com/)).toBeInTheDocument();
    expect(screen.getAllByTestId("icon-external")).toHaveLength(2);
    expect(screen.getAllByTestId("icon-copy")).toHaveLength(2);
    expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
  });

  it("truncates long URLs", () => {
    render(<UrlTable urls={urls} />);
    expect(screen.getByText(/verylongurl.com.*\.\.\./i)).toBeInTheDocument();
  });

  it("copies shortened URL to clipboard and shows check icon", async () => {
    jest.useFakeTimers();
    render(<UrlTable urls={urls} />);
    const copyButtons = screen.getAllByRole("button", { name: "" });
    // Copy button is the second button in the first row
    await act(async () => {
      fireEvent.click(copyButtons[1]);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${baseUrl}/exp456`,
    );
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    // After timeout, icon disappears
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByTestId("icon-check")).not.toBeInTheDocument();
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
    expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    expect(screen.getByTestId("icon-right")).toBeInTheDocument();
    // Click next page
    fireEvent.click(screen.getByTestId("icon-right"));
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
    expect(screen.getByTestId("icon-left")).toBeInTheDocument();
  });

  it("renders analytics and delete buttons", () => {
    render(<UrlTable urls={urls} />);
    expect(screen.getAllByTestId("icon-analytics")).toHaveLength(2);
    expect(screen.getAllByTestId("icon-trash")).toHaveLength(2);
  });
});
