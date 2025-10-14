import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";
import { describe, it, expect } from "vitest";

describe("NotFound", () => {
  it("renders the alert icon", () => {
    render(<NotFound />);

    const icon = screen.getByTestId("alert-icon");
    expect(icon).toBeDefined();
  });

  it("renders the heading", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: /link not found/i }),
    ).toBeDefined();
  });

  it("renders the not found message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(
        /the shortened url you're trying to access doesn't exist or has expired/i,
      ),
    ).toBeDefined();
  });

  it("renders a link to the homepage with correct attributes", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /go to homepage/i });
    expect(link).toBeDefined();
    expect(link.classList).toContain("bg-primary");
  });
});
