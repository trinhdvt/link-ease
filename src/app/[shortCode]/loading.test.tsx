import { render, screen } from "@testing-library/react";
import Loading from "./loading";

describe("Loading", () => {
  it("renders the loading spinner", () => {
    render(<Loading />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("renders the heading", () => {
    render(<Loading />);
    expect(
      screen.getByRole("heading", { name: /redirecting you/i }),
    ).toBeInTheDocument();
  });

  it("renders the redirect message", () => {
    render(<Loading />);
    expect(
      screen.getByText(
        /please wait while we redirect you to your destination/i,
      ),
    ).toBeInTheDocument();
  });
});
