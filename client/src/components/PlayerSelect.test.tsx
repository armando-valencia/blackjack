import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PlayerSelect from "./PlayerSelect";

afterEach(() => cleanup());

describe("PlayerSelect", () => {
	it("renders each player-count option", () => {
		const onSelectPlayerCount = vi.fn();

		render(<PlayerSelect onSelectPlayerCount={onSelectPlayerCount} isActionPending={false} />);

		expect(screen.getByRole("button", { name: /Just You Solo vs Dealer/i })).toBeTruthy();
		expect(screen.getByRole("button", { name: /4 Players You \+ 3 Bots/i })).toBeTruthy();
	});

	it("reports the selected player count", () => {
		const onSelectPlayerCount = vi.fn();

		render(<PlayerSelect onSelectPlayerCount={onSelectPlayerCount} isActionPending={false} />);
		fireEvent.click(screen.getByRole("button", { name: /3 Players You \+ 2 Bots/i }));

		expect(onSelectPlayerCount).toHaveBeenCalledWith(3);
	});

	it("keeps player choices disabled while setup is pending", () => {
		const onSelectPlayerCount = vi.fn();

		render(<PlayerSelect onSelectPlayerCount={onSelectPlayerCount} isActionPending />);

		expect(screen.getByText("Setting up the table...")).toBeTruthy();
		expect(screen.getAllByRole("button").every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
	});
});
