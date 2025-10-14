import { revealUrl } from "@/features/reveal-url/actions";
import UrlRevealForm from "@/features/reveal-url/components/url-reveal-form";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { vi, describe, it, type Mock } from "vitest";

vi.mock("@/features/reveal-url/components/url-result", () => {
  return {
    default: function UrlResult() {
      return <div>UrlResult</div>;
    },
  };
});

vi.mock("@/features/reveal-url/actions", () => {
  return {
    revealUrl: vi.fn(),
  };
});

const mockRevealUrl = (revealUrl as Mock).mockResolvedValue({
  originalUrl: "https://linkease.com",
  shortCode: "abc123",
});

describe(UrlRevealForm, () => {
  it("should render the url reveal form with default state", () => {
    render(<UrlRevealForm />);
    expect(screen.getByText("Shortened URL or Code")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "e.g., https://linkease.com/abc123 or abc123",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reveal Original URL" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reveal Original URL" }),
    ).toBeDisabled();
  });

  it("should show an error message when the input URL is not found", async () => {
    render(<UrlRevealForm />);

    mockRevealUrl.mockResolvedValue({
      error: "This shortened URL was not found in our system.",
      shortCode: "code-not-found",
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "code-not-found" },
    });
    act(() => {
      fireEvent.click(
        screen.getByRole("button", { name: "Reveal Original URL" }),
      );
    });

    await waitFor(() => {
      expect(mockRevealUrl).toHaveBeenCalledWith("code-not-found");
      expect(
        screen.getByText("This shortened URL was not found in our system."),
      ).toBeInTheDocument();
      expect(screen.queryByText("UrlResult")).not.toBeInTheDocument();
    });
  });

  it("should show the original URL when the input URL is found", async () => {
    render(<UrlRevealForm />);

    mockRevealUrl.mockResolvedValue({
      originalUrl: "https://linkease.com",
      shortCode: "abc123",
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "abc123" },
    });

    act(() => {
      fireEvent.click(
        screen.getByRole("button", { name: "Reveal Original URL" }),
      );
    });

    await waitFor(() => {
      expect(mockRevealUrl).toHaveBeenCalledWith("abc123");
      expect(screen.getByText("UrlResult")).toBeInTheDocument();
    });
  });
});
