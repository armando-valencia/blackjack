import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CARD_SUITS, GAME_RESULT, PLAYER_STATUS } from "../constants";
import type { PlayerState } from "../interfaces/game_interfaces";
import PlayerCard from "./PlayerCard";

afterEach(() => cleanup());

const PLAYER_NAME = "You";
const PLAYER_HAND = [`Q${CARD_SUITS.SPADES}`, `7${CARD_SUITS.CLUBS}`];
const HUMAN_PLAYER: PlayerState = {
	player_id: 1,
	name: PLAYER_NAME,
	hand: PLAYER_HAND,
	score: 17,
	status: PLAYER_STATUS.PLAYING,
	result: null,
	is_human: true,
};

describe("PlayerCard", () => {
	it("shows the human player's hand and current turn", () => {
		render(<PlayerCard player={HUMAN_PLAYER} isCurrentTurn />);

		expect(screen.getByRole("heading", { name: PLAYER_NAME })).toBeTruthy();
		expect(screen.getByText("Your turn")).toBeTruthy();
		expect(screen.getByRole("img", { name: "Q of spades" })).toBeTruthy();
	});

	it("shows a compact result summary for a completed bot", () => {
		const botPlayer: PlayerState = {
			...HUMAN_PLAYER,
			name: "Ivy",
			status: PLAYER_STATUS.DONE,
			result: GAME_RESULT.WIN,
			is_human: false,
		};

		render(<PlayerCard player={botPlayer} isCurrentTurn={false} variant="compact" />);

		expect(screen.getByText("Ivy")).toBeTruthy();
		expect(screen.getByText("Ivy Wins")).toBeTruthy();
	});
});
