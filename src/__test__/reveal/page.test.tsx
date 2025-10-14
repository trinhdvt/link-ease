import { vi, describe, it, expect } from "vitest";
import RevealPage from "@/app/reveal/page";
import { render, screen } from "@testing-library/react";

vi.mock("@/features/reveal-url/components/url-reveal-form", () => {
  return {
    default: function UrlRevealForm() {
      return <div>UrlRevealForm</div>;
    },
  };
});

describe(RevealPage, () => {
  it("should render the reveal page", () => {
    render(<RevealPage />);
    expect(screen.getByText("Reveal URL")).toBeDefined();
    expect(
      screen.getByText(
        "Enter a shortened URL to reveal its original destination",
      ),
    ).toBeDefined();
  });

  it("should render the url reveal form", () => {
    render(<RevealPage />);
    expect(screen.getByText("UrlRevealForm")).toBeDefined();
  });
});
