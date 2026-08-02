import React from "react";
import { GAME_RESULT, GAME_STATUS } from "../constants";
import type { GameResult, GameStatus } from "../interfaces/game_interfaces";

interface GameMessageProps {
	message: string;
	gameStatus: GameStatus;
	result: GameResult | null;
}

const GAME_RESULT_MESSAGE_CLASSES: Record<GameResult, string> = {
	[GAME_RESULT.WIN]: "text-table-active",
	[GAME_RESULT.LOSE]: "text-table-loss",
	[GAME_RESULT.PUSH]: "text-table-push",
};

const GameMessage: React.FC<GameMessageProps> = ({ message, gameStatus, result }) => {
	const getMessageClass = (): string => {
		if (gameStatus === GAME_STATUS.GAME_OVER) {
			if (result) return GAME_RESULT_MESSAGE_CLASSES[result];
		}
		return "text-table-muted";
	};

	return (
		<div className="text-center">
			<p className={`text-lg md:text-xl font-semibold ${getMessageClass()}`}>
				{message}
			</p>
		</div>
	);
};

export default GameMessage;
