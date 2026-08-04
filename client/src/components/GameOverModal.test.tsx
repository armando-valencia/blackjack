import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GAME_RESULT, PLAYER_STATUS } from "../constants";
import type { PlayerState } from "../interfaces/game_interfaces";
import GameOverModal from "./GameOverModal";

afterEach(() => cleanup());

const HUMAN_PLAYER: PlayerState = {
	player_id: 0,
	name: "You",
	hand: [],
	score: 21,
	status: PLAYER_STATUS.DONE,
	result: GAME_RESULT.WIN,
	is_human: true,
};

const BOT_PLAYER: PlayerState = {
	player_id: 1,
	name: "Ivy",
	hand: [],
	score: 17,
	status: PLAYER_STATUS.DONE,
	result: GAME_RESULT.LOSE,
	is_human: false,
};

describe("GameOverModal", () => {
	it("shows the round result, player stats, and actions in a dialog", () => {
		const onPlayAgain = vi.fn();
		const onReturnToMenu = vi.fn();

		render(
			<GameOverModal
				dealerScore={18}
				players={[HUMAN_PLAYER, BOT_PLAYER]}
				onPlayAgain={onPlayAgain}
				onReturnToMenu={onReturnToMenu}
				isActionPending={false}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Play Again" }));
		fireEvent.click(screen.getByRole("button", { name: "Back to Main Menu" }));

		expect(screen.getByRole("dialog", { name: "You win" })).toBeTruthy();
		expect(screen.getByText("18")).toBeTruthy();
		expect(screen.getByText("21")).toBeTruthy();
		expect(screen.getByText("Ivy")).toBeTruthy();
		expect(onPlayAgain).toHaveBeenCalledOnce();
		expect(onReturnToMenu).toHaveBeenCalledOnce();
	});

	it("returns to the main menu when Escape is pressed", () => {
		const onReturnToMenu = vi.fn();

		render(
			<GameOverModal
				dealerScore={18}
				players={[HUMAN_PLAYER]}
				onPlayAgain={vi.fn()}
				onReturnToMenu={onReturnToMenu}
				isActionPending={false}
			/>,
		);

		fireEvent.keyDown(document, { key: "Escape" });

		expect(onReturnToMenu).toHaveBeenCalledOnce();
	});
});
