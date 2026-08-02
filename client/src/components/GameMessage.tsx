import React from "react";
import { GAME_RESULT, GAME_STATUS } from "../constants";
import type { GameResult, GameStatus } from "../interfaces/game_interfaces";

interface GameMessageProps {
	message: string;
	gameStatus: GameStatus;
	result: GameResult | null;
}

const GameMessage: React.FC<GameMessageProps> = ({ message, gameStatus, result }) => {
	const getMessageColor = (): string => {
		if (gameStatus === GAME_STATUS.GAME_OVER) {
			if (result === GAME_RESULT.WIN) return "text-emerald-400";
			if (result === GAME_RESULT.LOSE) return "text-red-400";
			if (result === GAME_RESULT.PUSH) return "text-blue-400";
		}
		return "text-slate-300";
	};

	return (
		<div className="text-center">
			<p className={`text-lg md:text-xl font-semibold ${getMessageColor()}`}>
				{message}
			</p>
		</div>
	);
};

export default GameMessage;
