import Navigation from "@/components/Navigation";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

describe("Navigation", () => {
  it("should render all navigation items", () => {
    render(<Navigation />);
    expect(screen.getByText("Shorten URL")).toBeInTheDocument();
    expect(screen.getByText("Reveal URL")).toBeInTheDocument();
  });

  it("should render the correct navigation item as active", () => {
    render(<Navigation />);
    expect(screen.getByText("Shorten URL")).toHaveClass("text-blue-600");
  });
});
