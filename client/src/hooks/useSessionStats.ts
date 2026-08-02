import { useEffect, useRef, useState } from "react";
import { GAME_RESULT, GAME_STATUS } from "../constants";
import type { GameResult, GameStatus } from "../interfaces/game_interfaces";

export interface SessionStats {
	handsPlayed: number;
	wins: number;
	losses: number;
	pushes: number;
}

const EMPTY_SESSION_STATS: SessionStats = {
	handsPlayed: 0,
	wins: 0,
	losses: 0,
	pushes: 0,
};

export const useSessionStats = (gameStatus: GameStatus | null, playerResult: GameResult | null) => {
	const [stats, setStats] = useState<SessionStats>(EMPTY_SESSION_STATS);
	const countedGameOverRef = useRef(false);

	useEffect(() => {
		if (gameStatus !== GAME_STATUS.GAME_OVER) {
			countedGameOverRef.current = false;
			return;
		}

		if (!playerResult || countedGameOverRef.current) return;

		countedGameOverRef.current = true;
		setStats((currentStats) => ({
			handsPlayed: currentStats.handsPlayed + 1,
			wins: currentStats.wins + (playerResult === GAME_RESULT.WIN ? 1 : 0),
			losses: currentStats.losses + (playerResult === GAME_RESULT.LOSE ? 1 : 0),
			pushes: currentStats.pushes + (playerResult === GAME_RESULT.PUSH ? 1 : 0),
		}));
	}, [gameStatus, playerResult]);

	const resetStats = () => {
		setStats(EMPTY_SESSION_STATS);
	};

	return { stats, resetStats };
};
