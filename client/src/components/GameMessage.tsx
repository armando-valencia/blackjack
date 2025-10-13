import React from "react";

interface GameMessageProps {
	message: string;
	gameStatus: "waiting" | "playing" | "dealer_turn" | "game_over";
	result: "win" | "lose" | "push" | null;
}

const GameMessage: React.FC<GameMessageProps> = ({ message, gameStatus, result }) => {
	const getMessageColor = (): string => {
		if (gameStatus === "game_over") {
			if (result === "win") return "text-emerald-400";
			if (result === "lose") return "text-red-400";
			if (result === "push") return "text-blue-400";
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
