import { vi, describe, it, expect } from "vitest";
import Navigation from "@/components/header/navigation";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

describe("Navigation", () => {
  it("should render all navigation items", () => {
    render(<Navigation />);
    expect(screen.getByText("Shorten URL")).toBeDefined();
    expect(screen.getByText("Reveal URL")).toBeDefined();
  });

  it("should render the correct navigation item as active", () => {
    render(<Navigation />);
    expect(screen.getByText("Shorten URL").classList).toContain("text-primary");
  });
});
