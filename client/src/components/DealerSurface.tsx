import React from "react";
import { GAME_STATUS } from "../constants";
import type { GameStatus } from "../interfaces/game_interfaces";
import Card from "./Card";

interface DealerSurfaceProps {
	dealerHand: string[];
	dealerScore: number;
	gameStatus: GameStatus;
}

const DEALER_PHASE_CLASSES: Record<GameStatus, string> = {
	[GAME_STATUS.WAITING]: "text-table-muted",
	[GAME_STATUS.PLAYING]: "text-table-active-bot",
	[GAME_STATUS.DEALER_TURN]: "text-table-active-bot",
	[GAME_STATUS.GAME_OVER]: "text-table-text",
};

const DEALER_PHASE_LABELS: Record<GameStatus, string> = {
	[GAME_STATUS.WAITING]: "Ready to deal",
	[GAME_STATUS.PLAYING]: "Watching the table",
	[GAME_STATUS.DEALER_TURN]: "Dealer's turn",
	[GAME_STATUS.GAME_OVER]: "Final hand",
};

const DEALER_PHASE_MESSAGES: Record<GameStatus, string> = {
	[GAME_STATUS.WAITING]: "The dealer is ready.",
	[GAME_STATUS.PLAYING]: "The dealer's hole card is hidden.",
	[GAME_STATUS.DEALER_TURN]: "The dealer is revealing the hand.",
	[GAME_STATUS.GAME_OVER]: "The dealer's hand is complete.",
};

const DealerSurface: React.FC<DealerSurfaceProps> = ({ dealerHand, dealerScore, gameStatus }) => {
	const isDealerTurn = gameStatus === GAME_STATUS.DEALER_TURN;

	return (
		<section
			aria-labelledby="dealer-surface-title"
			className="bg-table-surface-raised/30 border-b border-table-border/30 p-4 md:p-6"
		>
			<div className="flex flex-wrap items-start justify-between gap-3 mb-5">
				<div>
					<p className="text-table-subtle text-xs font-medium tracking-[0.2em] uppercase">House</p>
					<h2 id="dealer-surface-title" className="text-table-text text-xl md:text-2xl font-semibold">
						Dealer
					</h2>
				</div>
				<div className="flex items-center gap-3">
					<span className={`text-xs font-medium uppercase tracking-wider ${DEALER_PHASE_CLASSES[gameStatus]}`}>
						{DEALER_PHASE_LABELS[gameStatus]}
					</span>
					<div className="bg-table-surface/60 border border-table-border/50 rounded-lg px-3 py-2 text-right">
						<p className="text-table-muted text-[0.65rem] uppercase tracking-wider">Score</p>
						<p className="text-table-text text-lg font-bold leading-none">{dealerScore}</p>
					</div>
				</div>
			</div>

			<div className="bg-table-surface/20 border border-table-border/20 rounded-xl px-3 py-4 md:px-6 md:py-5">
				<div className="flex w-full max-w-full flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
					{dealerHand.map((cardString, index) => (
						<Card
							key={`dealer-${cardString}-${index}`}
							card={cardString}
							index={index}
							isDealerHoleCard={index === 1}
						/>
					))}
				</div>
			</div>

			<p className={`mt-3 text-center text-sm ${DEALER_PHASE_CLASSES[gameStatus]}`} aria-live={isDealerTurn ? "polite" : "off"}>
				{DEALER_PHASE_MESSAGES[gameStatus]}
			</p>
		</section>
	);
};

export default DealerSurface;
