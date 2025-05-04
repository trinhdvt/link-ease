import { getCurrentUser } from "@/lib/auth";
import { type UrlData, getUserUrls } from "@/lib/data";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import DashboardPage from "./page";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock("@/lib/data", () => ({
  getUserUrls: jest.fn(),
}));

jest.mock("@/features/url-dashboard/components/url-dashboard", () => {
  return function MockUrlDashboard({ urls }: { urls: UrlData[] }) {
    return <div data-testid="url-dashboard">{urls.length} URLs</div>;
  };
});

describe("DashboardPage", () => {
  const mockUser = {
    id: "user123",
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
  });

  it("redirects to 404 if user is not authenticated", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    render(await DashboardPage());

    expect(notFound).toHaveBeenCalled();
  });

  it("fetches and displays user's URLs when authenticated", async () => {
    const mockUrls = [
      {
        id: "1",
        shortCode: "abc",
        originalUrl: "https://example.com",
        expiresAt: "2099-01-01",
        createdAt: "2023-01-01",
        clicks: 5,
      },
      {
        id: "2",
        shortCode: "def",
        originalUrl: "https://example.org",
        expiresAt: "2099-01-01",
        createdAt: "2023-01-02",
        clicks: 10,
      },
    ];

    (getUserUrls as jest.Mock).mockResolvedValue(mockUrls);

    render(await DashboardPage());

    expect(getCurrentUser).toHaveBeenCalled();
    expect(getUserUrls).toHaveBeenCalledWith(mockUser.id);

    expect(screen.getByText("My URLs")).toBeInTheDocument();
    expect(
      screen.getByText("Manage and track all your shortened URLs in one place"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("url-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("url-dashboard").textContent).toBe("2 URLs");
  });

  it("passes empty array to UrlDashboard when user has no URLs", async () => {
    const mockUrls: UrlData[] = [];

    (getUserUrls as jest.Mock).mockResolvedValue(mockUrls);

    render(await DashboardPage());

    expect(getUserUrls).toHaveBeenCalledWith(mockUser.id);
    expect(screen.getByTestId("url-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("url-dashboard").textContent).toBe("0 URLs");
  });

  it("handles error during data fetching", async () => {
    (getUserUrls as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

    await expect(async () => {
      render(await DashboardPage());
    }).rejects.toThrow("Failed to fetch");
  });
});
