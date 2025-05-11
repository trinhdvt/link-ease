import RedirectPage from "./page";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

jest.mock("@/features/url-shorten/actions/get-original-url", () => ({
  getOriginalUrl: jest.fn(),
}));
jest.mock("next/headers");
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

describe("RedirectPage", () => {
  const mockShortCode = "abc123";
  const mockHeaders = { get: jest.fn() };
  const paramsPromise = Promise.resolve({ shortCode: mockShortCode });
  const {
    getOriginalUrl,
  } = require("@/features/url-shorten/actions/get-original-url");

  beforeEach(() => {
    jest.clearAllMocks();
    (headers as jest.Mock).mockReturnValue(Promise.resolve(mockHeaders));
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
