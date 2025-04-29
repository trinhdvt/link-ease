import RevealPage from "@/app/reveal/page";
import { render, screen } from "@testing-library/react";

jest.mock("@/features/reveal-url/components/url-reveal-form", () => {
  return function UrlRevealForm() {
    return <div>UrlRevealForm</div>;
  };
});

describe(RevealPage, () => {
  it("should render the reveal page", () => {
    render(<RevealPage />);
    expect(screen.getByText("Reveal URL")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter a shortened URL to reveal its original destination",
      ),
    ).toBeInTheDocument();
  });

  it("should render the url reveal form", () => {
    render(<RevealPage />);
    expect(screen.getByText("UrlRevealForm")).toBeInTheDocument();
  });
});
