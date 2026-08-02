import React from "react";
import { GAME_RESULT, GAME_STATUS } from "../constants";
import type { GameResult, GameStatus } from "../interfaces/game_interfaces";

interface GameMessageProps {
	message: string;
	gameStatus: GameStatus;
	result: GameResult | null;
}

const GameMessage: React.FC<GameMessageProps> = ({ message, gameStatus, result }) => {
	const getMessageClass = (): string => {
		if (gameStatus === GAME_STATUS.GAME_OVER) {
			if (result === GAME_RESULT.WIN) return "table-status--win";
			if (result === GAME_RESULT.LOSE) return "table-status--loss";
			if (result === GAME_RESULT.PUSH) return "table-status--push";
		}
		return "table-message--default";
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
