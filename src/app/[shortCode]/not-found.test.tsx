import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the alert icon", () => {
    render(<NotFound />);

    const icon = screen.getByTestId("alert-icon");
    expect(icon).toBeInTheDocument();
  });

  it("renders the heading", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: /link not found/i }),
    ).toBeInTheDocument();
  });

  it("renders the not found message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(
        /the shortened url you're trying to access doesn't exist or has expired/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders a link to the homepage with correct attributes", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /go to homepage/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveClass("bg-primary");
  });
});
