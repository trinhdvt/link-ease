import RevealPage from "@/app/reveal/page";
import { render, screen } from "@testing-library/react";

describe("Reveal Page", () => {
	it("should render", () => {
		render(<RevealPage />);
		expect(screen.getByText("Reveal Shortened URL")).toBeInTheDocument();
	});
});
