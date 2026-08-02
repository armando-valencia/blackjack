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
	"min-w-0 bg-table-surface-raised/30 backdrop-blur-sm border-2 border-table-border/30 rounded-xl transition-all duration-300";
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
const PLAYER_RESULT_SUMMARY_LABELS: Record<GameResult, { human: string; bot: string }> = {
	[GAME_RESULT.WIN]: { human: "You win!", bot: "Wins" },
	[GAME_RESULT.LOSE]: { human: "You lose", bot: "Loses" },
	[GAME_RESULT.PUSH]: { human: "Push", bot: "Push" },
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
const PLAYER_STATUS_FRAME_CLASSES: Record<PlayerStatus, string> = {
	[PLAYER_STATUS.WAITING]: "animate-[statusChange_0.25s_ease-out]",
	[PLAYER_STATUS.PLAYING]: "animate-[statusChange_0.25s_ease-out]",
	[PLAYER_STATUS.STANDING]: "animate-[statusChange_0.25s_ease-out]",
	[PLAYER_STATUS.BUST]: "border-table-loss/70 shadow-[0_0_16px_rgba(248,113,113,0.25)] animate-[bustPulse_0.45s_ease-out]",
	[PLAYER_STATUS.DONE]: "",
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
		return PLAYER_STATUS_FRAME_CLASSES[player.status];
	};

	const nameClass = player.is_human ? "text-table-active" : "text-table-dealer";
	const scoreClass = player.is_human ? "text-table-active" : "text-table-text";
	const roleLabel = player.is_human ? "You" : "Bot";
	const turnLabel = player.is_human ? "Your turn" : "Bot turn";
	const resultLabel = player.result
		? player.is_human
			? PLAYER_RESULT_SUMMARY_LABELS[player.result].human
			: player.result === GAME_RESULT.PUSH
				? PLAYER_RESULT_SUMMARY_LABELS[player.result].bot
				: `${player.name} ${PLAYER_RESULT_SUMMARY_LABELS[player.result].bot}`
		: "";
	const turnIndicator = isCurrentTurn ? (
		<span className="bg-table-surface/60 text-table-text inline-flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium">
			<span aria-hidden="true">●</span>
			{turnLabel}
		</span>
	) : null;

	if (variant === "compact") {
		return (
			<div className={`${PLAYER_BASE_CLASSES} p-3 sm:p-4 ${getBorderClass()}`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="min-w-0 flex flex-1 items-center gap-2">
						<span className={`truncate text-sm font-medium ${nameClass}`}>{player.name}</span>
						<span className="text-table-subtle text-xs">({roleLabel})</span>
					</div>
					<div className="flex flex-wrap items-center justify-end gap-2">
						<span className="text-table-muted text-sm">{player.hand.length} cards</span>
						<div className="bg-table-surface/60 border border-table-border/50 rounded px-2 py-1">
							<span className="text-table-subtle text-[0.6rem] uppercase tracking-wider mr-1">Score</span>
							<span className="text-table-text font-bold text-sm" aria-label={`Score ${player.score}`}>{player.score}</span>
						</div>
					</div>
				</div>
				<div className="mt-2 flex flex-wrap items-center gap-2">
						{turnIndicator}
						{getStatusText() && !player.result && <span className={`text-xs font-medium ${getStatusClass()}`}>{getStatusText()}</span>}
						{resultLabel && <span className={`text-xs font-medium ${getStatusClass()}`}>{resultLabel}</span>}
				</div>
			</div>
		);
	}

	return (
		<div className={`${PLAYER_BASE_CLASSES} p-4 md:p-6 ${getBorderClass()}`}>
			<div className="flex items-start justify-between gap-3 mb-4">
				<div className="min-w-0 flex flex-wrap items-center gap-2">
					<h3 className={`truncate text-base md:text-lg font-medium ${nameClass}`}>{player.name}</h3>
					<span className="text-table-subtle text-xs">({roleLabel})</span>
					{turnIndicator}
					{isCurrentTurn && getStatusText() && (
						<span className={`bg-table-surface/60 px-2 py-0.5 rounded text-xs font-medium ${getStatusClass()}`}>
							{getStatusText()}
						</span>
					)}
				</div>
				<div className={`shrink-0 bg-table-surface/60 border border-table-border/50 px-3 py-1 rounded-md ${player.is_human ? "bg-table-active/10 border-table-active/30" : ""}`}>
					<span className={`${scoreClass} font-bold`}>{player.score}</span>
				</div>
			</div>

			<div className="flex justify-center">
				<div className="flex w-full max-w-full gap-1.5 sm:gap-2 md:gap-3 flex-wrap justify-center">
					{player.hand.map((cardString, index) => (
						<Card key={`${player.player_id}-${cardString}-${index}`} card={cardString} index={index} />
					))}
				</div>
			</div>

			{player.status === PLAYER_STATUS.DONE && player.result && (
				<div className="mt-4 flex justify-center">
					<div className={`px-6 py-2 rounded-lg font-bold text-lg border-2 animate-[resultReveal_0.35s_ease-out] ${PLAYER_RESULT_BADGE_CLASSES[player.result]}`}>
						{player.is_human ? PLAYER_RESULT_LABELS[player.result] : resultLabel}
					</div>
				</div>
			)}
		</div>
	);
};

export default PlayerCard;
