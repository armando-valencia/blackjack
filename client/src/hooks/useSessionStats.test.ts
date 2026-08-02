import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GAME_RESULT, GAME_STATUS } from "../constants";
import type { GameResult, GameStatus } from "../interfaces/game_interfaces";
import { useSessionStats } from "./useSessionStats";

interface SessionStatsTestProps {
	gameStatus: GameStatus;
	playerResult: GameResult | null;
}

describe("useSessionStats", () => {
	it("counts a completed round once", () => {
		const { result, rerender } = renderHook<ReturnType<typeof useSessionStats>, SessionStatsTestProps>(
			({ gameStatus, playerResult }: SessionStatsTestProps) => useSessionStats(gameStatus, playerResult),
			{
				initialProps: { gameStatus: GAME_STATUS.PLAYING, playerResult: null },
			},
		);

		rerender({ gameStatus: GAME_STATUS.GAME_OVER, playerResult: GAME_RESULT.WIN });
		rerender({ gameStatus: GAME_STATUS.GAME_OVER, playerResult: GAME_RESULT.WIN });

		expect(result.current.stats).toEqual({ handsPlayed: 1, wins: 1, losses: 0, pushes: 0 });
	});

	it("tracks each result after a new round starts", () => {
		const { result, rerender } = renderHook<ReturnType<typeof useSessionStats>, SessionStatsTestProps>(
			({ gameStatus, playerResult }: SessionStatsTestProps) => useSessionStats(gameStatus, playerResult),
			{
				initialProps: { gameStatus: GAME_STATUS.PLAYING, playerResult: null },
			},
		);

		rerender({ gameStatus: GAME_STATUS.GAME_OVER, playerResult: GAME_RESULT.LOSE });
		rerender({ gameStatus: GAME_STATUS.PLAYING, playerResult: null });
		rerender({ gameStatus: GAME_STATUS.GAME_OVER, playerResult: GAME_RESULT.PUSH });

		expect(result.current.stats).toEqual({ handsPlayed: 2, wins: 0, losses: 1, pushes: 1 });
	});

	it("resets all session totals", () => {
		const { result, rerender } = renderHook<ReturnType<typeof useSessionStats>, SessionStatsTestProps>(
			({ gameStatus, playerResult }: SessionStatsTestProps) => useSessionStats(gameStatus, playerResult),
			{
				initialProps: { gameStatus: GAME_STATUS.GAME_OVER, playerResult: GAME_RESULT.WIN },
			},
		);

		act(() => result.current.resetStats());
		rerender({ gameStatus: GAME_STATUS.PLAYING, playerResult: null });

		expect(result.current.stats).toEqual({ handsPlayed: 0, wins: 0, losses: 0, pushes: 0 });
	});
});
