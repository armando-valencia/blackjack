import React from "react";
import Card from "./Card";
import { GAME_RESULT, PLAYER_STATUS } from "../constants";
import type { GameResult, PlayerState, PlayerStatus } from "../interfaces/game_interfaces";

interface PlayerCardProps {
	player: PlayerState;
	isCurrentTurn: boolean;
	variant?: "compact" | "full";
}

const PLAYER_BASE_CLASSES =
	"bg-table-surface-raised/30 backdrop-blur-sm border-2 border-table-border/30 rounded-xl transition-all duration-300";
const PLAYER_STATUS_CLASSES: Record<PlayerStatus, string> = {
	[PLAYER_STATUS.WAITING]: "text-table-muted",
	[PLAYER_STATUS.PLAYING]: "text-table-muted",
	[PLAYER_STATUS.STANDING]: "text-table-muted",
	[PLAYER_STATUS.BUST]: "text-table-loss",
	[PLAYER_STATUS.DONE]: "text-table-muted",
};
const PLAYER_RESULT_CLASSES: Record<GameResult, string> = {
	[GAME_RESULT.WIN]: "text-table-active",
	[GAME_RESULT.LOSE]: "text-table-loss",
	[GAME_RESULT.PUSH]: "text-table-push",
};
const PLAYER_RESULT_BADGE_CLASSES: Record<GameResult, string> = {
	[GAME_RESULT.WIN]: "bg-table-active/20 border-table-active text-table-active",
	[GAME_RESULT.LOSE]: "bg-table-loss/20 border-table-loss text-table-loss",
	[GAME_RESULT.PUSH]: "bg-table-push/20 border-table-push text-table-push",
};
const PLAYER_RESULT_STATUS_LABELS: Record<GameResult, string> = {
	[GAME_RESULT.WIN]: "WON",
	[GAME_RESULT.LOSE]: "LOST",
	[GAME_RESULT.PUSH]: "PUSH",
};
const PLAYER_RESULT_LABELS: Record<GameResult, string> = {
	[GAME_RESULT.WIN]: "YOU WIN!",
	[GAME_RESULT.LOSE]: "YOU LOSE",
	[GAME_RESULT.PUSH]: "PUSH",
};
const PLAYER_STATUS_LABELS: Partial<Record<PlayerStatus, string>> = {
	[PLAYER_STATUS.BUST]: "BUST",
	[PLAYER_STATUS.STANDING]: "STANDING",
	[PLAYER_STATUS.WAITING]: "WAITING",
};
const PLAYER_TURN_CLASSES = {
	human: "border-table-active/70 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
	bot: "border-table-active-bot/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
	complete: "opacity-70",
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentTurn, variant = "full" }) => {
	const getStatusClass = () => {
		if (player.result) return PLAYER_RESULT_CLASSES[player.result];
		if (isCurrentTurn && player.is_human) return "text-table-active";
		if (isCurrentTurn) return "text-table-active-bot";
		return PLAYER_STATUS_CLASSES[player.status];
	};

	const getStatusText = () => {
		if (player.status === PLAYER_STATUS.PLAYING && isCurrentTurn) return "TURN";
		if (player.status === PLAYER_STATUS.DONE && player.result) return PLAYER_RESULT_STATUS_LABELS[player.result];
		return PLAYER_STATUS_LABELS[player.status] ?? "";
	};

	const getBorderClass = () => {
		if (isCurrentTurn && player.is_human) return PLAYER_TURN_CLASSES.human;
		if (isCurrentTurn) return PLAYER_TURN_CLASSES.bot;
		if (player.status === PLAYER_STATUS.DONE) return PLAYER_TURN_CLASSES.complete;
		return "";
	};

	const nameClass = player.is_human ? "text-table-active" : "text-table-dealer";
	const scoreClass = player.is_human ? "text-table-active" : "text-table-text";

	if (variant === "compact") {
		return (
			<div className={`${PLAYER_BASE_CLASSES} p-3 ${getBorderClass()}`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className={`text-sm font-medium ${nameClass}`}>{player.name}</span>
						{!player.is_human && <span className="text-table-subtle text-xs">(Bot)</span>}
					</div>
					<div className="flex items-center gap-3">
						<span className="text-table-muted text-sm">{player.hand.length} cards</span>
						<div className="bg-table-surface/60 border border-table-border/50 px-2 py-1 rounded">
							<span className="text-table-text font-bold text-sm">{player.score}</span>
						</div>
						{getStatusText() && <span className={`text-xs font-medium ${getStatusClass()}`}>{getStatusText()}</span>}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`${PLAYER_BASE_CLASSES} p-4 md:p-6 ${getBorderClass()}`}>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<h3 className={`text-base md:text-lg font-medium ${nameClass}`}>{player.name}</h3>
					{!player.is_human && <span className="text-table-subtle text-xs">(Bot)</span>}
					{isCurrentTurn && (
						<span className={`bg-table-surface/60 ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusClass()}`}>
							{getStatusText()}
						</span>
					)}
				</div>
				<div className={`bg-table-surface/60 border border-table-border/50 px-3 py-1 rounded-md ${player.is_human ? "bg-table-active/10 border-table-active/30" : ""}`}>
					<span className={`${scoreClass} font-bold`}>{player.score}</span>
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
					<div className={`px-6 py-2 rounded-lg font-bold text-lg border-2 ${PLAYER_RESULT_BADGE_CLASSES[player.result]}`}>
						{PLAYER_RESULT_LABELS[player.result]}
					</div>
				</div>
			)}
		</div>
	);
};

export default PlayerCard;
