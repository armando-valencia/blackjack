import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

afterEach(() => cleanup());

describe("ErrorBoundary", () => {
	it("shows a recoverable fallback when a child fails to render", () => {
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
		const BrokenChild = () => {
			throw new Error("render failure");
		};

		render(
			<ErrorBoundary>
				<BrokenChild />
			</ErrorBoundary>,
		);

		expect(screen.getByRole("alert")).toBeTruthy();
		expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeTruthy();
		consoleError.mockRestore();
	});
});
