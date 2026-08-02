import React from "react";
import Card from "./Card";
import { GAME_RESULT, PLAYER_STATUS } from "../constants";
import type { PlayerState } from "../interfaces/game_interfaces";

interface PlayerCardProps {
	player: PlayerState;
	isCurrentTurn: boolean;
	variant?: "compact" | "full";
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentTurn, variant = "full" }) => {
	const getStatusClass = () => {
		if (player.result === GAME_RESULT.WIN) return "table-status--win";
		if (player.result === GAME_RESULT.LOSE) return "table-status--loss";
		if (player.result === GAME_RESULT.PUSH) return "table-status--push";
		if (isCurrentTurn && player.is_human) return "table-status--turn";
		if (isCurrentTurn) return "table-status--bot-turn";
		if (player.status === PLAYER_STATUS.BUST) return "table-status--bust";
		if (player.status === PLAYER_STATUS.STANDING) return "table-status--standing";
		return "table-status--waiting";
	};

	const getStatusText = () => {
		if (player.status === PLAYER_STATUS.BUST) return "BUST";
		if (player.status === PLAYER_STATUS.STANDING) return "STANDING";
		if (player.status === PLAYER_STATUS.PLAYING && isCurrentTurn) return "TURN";
		if (player.status === PLAYER_STATUS.WAITING) return "WAITING";
		if (player.status === PLAYER_STATUS.DONE) {
			if (player.result === GAME_RESULT.WIN) return "WON";
			if (player.result === GAME_RESULT.LOSE) return "LOST";
			if (player.result === GAME_RESULT.PUSH) return "PUSH";
		}
		return "";
	};

	const getBorderClass = () => {
		if (isCurrentTurn && player.is_human) return "table-player--active-human";
		if (isCurrentTurn) return "table-player--active-bot";
		if (player.status === PLAYER_STATUS.DONE) return "table-player--complete";
		return "";
	};

	if (variant === "compact") {
		return (
			<div
				className={`table-player rounded-xl p-3 ${getBorderClass()}`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className={`text-sm font-medium ${player.is_human ? "table-player__name--human" : "table-player__name--bot"}`}>
							{player.name}
						</span>
						{!player.is_human && <span className="table-player__meta text-xs">(Bot)</span>}
					</div>
					<div className="flex items-center gap-3">
						<span className="table-player__meta text-sm">{player.hand.length} cards</span>
						<div className="table-score px-2 py-1 rounded">
							<span className="font-bold text-sm">{player.score}</span>
						</div>
						{getStatusText() && (
							<span className={`text-xs font-medium ${getStatusClass()}`}>{getStatusText()}</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`table-player rounded-xl p-4 md:p-6 ${getBorderClass()}`}
		>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<h3 className={`text-base md:text-lg font-medium ${player.is_human ? "table-player__name--human" : "table-player__name--bot"}`}>
						{player.name}
					</h3>
					{!player.is_human && <span className="table-player__meta text-xs">(Bot)</span>}
					{isCurrentTurn && (
						<span className={`table-status-badge ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusClass()}`}>
							{getStatusText()}
						</span>
					)}
				</div>
				<div className={`table-score ${player.is_human ? "table-score--human" : ""} px-3 py-1 rounded-md`}>
					<span className="font-bold">
						{player.score}
					</span>
				</div>
			</div>

			<div className="flex justify-center">
				<div className="flex gap-2 md:gap-3 flex-wrap justify-center">
					{player.hand.map((cardString, index) => (
						<Card key={`${player.player_id}-${cardString}-${index}`} card={cardString} index={index} />
					))}
				</div>
			</div>

			{player.status === PLAYER_STATUS.DONE && player.result && (
				<div className="mt-4 flex justify-center">
					<div
						className={`table-result px-6 py-2 rounded-lg font-bold text-lg ${
							player.result === GAME_RESULT.WIN
								? "table-result--win"
							: player.result === GAME_RESULT.LOSE
								? "table-result--loss"
								: "table-result--push"
						}`}
					>
						{player.result === GAME_RESULT.WIN ? "YOU WIN!" : player.result === GAME_RESULT.LOSE ? "YOU LOSE" : "PUSH"}
					</div>
				</div>
			)}
		</div>
	);
};

export default PlayerCard;
