import { vi, describe, it, beforeEach, type Mock, expect } from "vitest";
import RedirectPage from "./page";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import * as getOriginalUrlModule from "@/features/url-shorten/actions/get-original-url";

vi.mock("@/features/url-shorten/actions/get-original-url", () => ({
  getOriginalUrl: vi.fn(),
}));
vi.mock("next/headers");
vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

describe("RedirectPage", () => {
  const mockShortCode = "abc123";
  const mockHeaders = { get: vi.fn() };
  const paramsPromise = Promise.resolve({ shortCode: mockShortCode });
  const getOriginalUrl = getOriginalUrlModule.getOriginalUrl as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    (headers as Mock).mockReturnValue(Promise.resolve(mockHeaders));
  });

  it("redirects to the original URL if found", async () => {
    getOriginalUrl.mockResolvedValue("https://example.com");
    await RedirectPage({ params: paramsPromise });
    expect(redirect).toHaveBeenCalledWith("https://example.com");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("calls notFound if original URL is not found", async () => {
    getOriginalUrl.mockResolvedValue(null);
    await RedirectPage({ params: paramsPromise });
    expect(notFound).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
