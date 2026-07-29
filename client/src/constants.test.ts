import { describe, expect, it } from "vitest";
import { CARD_SUITS, GAME_RESULT, GAME_STATUS, PLAYER_STATUS } from "./constants";

describe("game constants", () => {
	it("define the supported game lifecycle values", () => {
		expect(Object.values(GAME_STATUS)).toEqual(["waiting", "playing", "dealer_turn", "game_over"]);
	});

	it("define unique card suits", () => {
		const suitValues = Object.values(CARD_SUITS);

		expect(new Set(suitValues).size).toBe(suitValues.length);
		expect(suitValues).toHaveLength(4);
	});

	it("define player outcomes and statuses", () => {
		expect(Object.values(GAME_RESULT)).toEqual(["win", "lose", "push"]);
		expect(Object.values(PLAYER_STATUS)).toEqual(["waiting", "playing", "standing", "bust", "done"]);
	});
});
