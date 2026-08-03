import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import GameNavigation from "./GameNavigation";

afterEach(() => cleanup());

describe("GameNavigation", () => {
	it("offers restart and menu actions", () => {
		const onRestart = vi.fn();
		const onReturnToMenu = vi.fn();

		render(
			<GameNavigation
				onRestart={onRestart}
				onReturnToMenu={onReturnToMenu}
				isActionPending={false}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "New Game" }));
		fireEvent.click(screen.getByRole("button", { name: "Main Menu" }));

		expect(onRestart).toHaveBeenCalledOnce();
		expect(onReturnToMenu).toHaveBeenCalledOnce();
	});

	it("disables navigation while another action is pending", () => {
		render(
			<GameNavigation
				onRestart={vi.fn()}
				onReturnToMenu={vi.fn()}
				isActionPending
			/>,
		);

		expect((screen.getByRole("button", { name: "New Game" }) as HTMLButtonElement).disabled).toBe(true);
		expect((screen.getByRole("button", { name: "Main Menu" }) as HTMLButtonElement).disabled).toBe(true);
	});
});
