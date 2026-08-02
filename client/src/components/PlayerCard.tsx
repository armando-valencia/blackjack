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
	const getStatusColor = () => {
		if (player.result === GAME_RESULT.WIN) return "text-emerald-400";
		if (player.result === GAME_RESULT.LOSE) return "text-red-400";
		if (player.result === GAME_RESULT.PUSH) return "text-slate-400";
		if (isCurrentTurn) return "text-emerald-400";
		return "text-slate-400";
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
		if (isCurrentTurn && player.is_human) {
			return "border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.3)]";
		}
		if (isCurrentTurn) {
			return "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]";
		}
		if (player.status === PLAYER_STATUS.DONE) {
			return "border-slate-700/30 opacity-70";
		}
		return "border-slate-700/30";
	};

	// Compact variant for bots on mobile
	if (variant === "compact") {
		return (
			<div
				className={`bg-slate-800/30 backdrop-blur-sm border-2 rounded-xl p-3 transition-all duration-300 ${getBorderClass()}`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className={`text-sm font-medium ${player.is_human ? "text-emerald-400" : "text-slate-300"}`}>
							{player.name}
						</span>
						{!player.is_human && <span className="text-xs text-slate-500">(Bot)</span>}
					</div>
					<div className="flex items-center gap-3">
						<span className="text-slate-400 text-sm">{player.hand.length} cards</span>
						<div className="px-2 py-1 bg-slate-900/60 border border-slate-600/50 rounded">
							<span className="text-white font-bold text-sm">{player.score}</span>
						</div>
						{getStatusText() && (
							<span className={`text-xs font-medium ${getStatusColor()}`}>{getStatusText()}</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	// Full variant with cards displayed
	return (
		<div
			className={`bg-slate-800/30 backdrop-blur-sm border-2 rounded-xl p-4 md:p-6 transition-all duration-300 ${getBorderClass()}`}
		>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<h3 className={`text-base md:text-lg font-medium ${player.is_human ? "text-emerald-400" : "text-slate-300"}`}>
						{player.name}
					</h3>
					{!player.is_human && <span className="text-xs text-slate-500">(Bot)</span>}
					{isCurrentTurn && (
						<span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor()} bg-slate-900/60`}>
							{getStatusText()}
						</span>
					)}
				</div>
				<div className={`px-3 py-1 ${player.is_human ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-900/60 border-slate-600/50"} border rounded-md`}>
					<span className={`${player.is_human ? "text-emerald-400" : "text-white"} font-bold`}>
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
						className={`px-6 py-2 rounded-lg font-bold text-lg ${
							player.result === GAME_RESULT.WIN
								? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
								: player.result === GAME_RESULT.LOSE
								? "bg-red-500/20 border-2 border-red-500 text-red-400"
								: "bg-blue-500/20 border-2 border-blue-500 text-blue-400"
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
