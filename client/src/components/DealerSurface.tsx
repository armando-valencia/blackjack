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
			className="shrink-0 border-b border-table-border/40 bg-table-surface-raised/25 p-2 sm:p-3 md:p-4"
		>
			<div className="mb-2 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
				<div>
					<p className="text-table-subtle text-xs font-medium uppercase tracking-wider">House</p>
					<h2 id="dealer-surface-title" className="font-serif text-xl font-semibold text-table-text md:text-2xl">
						Dealer
					</h2>
				</div>
				<div className="flex items-center gap-3">
					<span className={`text-xs font-medium uppercase tracking-wide ${DEALER_PHASE_CLASSES[gameStatus]}`}>
						{DEALER_PHASE_LABELS[gameStatus]}
					</span>
					<dl className="rounded-md border border-table-border/60 bg-table-surface px-3 py-1.5 text-right">
						<dt className="text-table-muted text-[0.65rem] uppercase tracking-wide">Score</dt>
						<dd className="text-table-text text-lg font-bold leading-none">{dealerScore}</dd>
					</dl>
				</div>
			</div>

			<div className="border-y border-table-border/20 bg-table-page-start/15 px-2 py-2 sm:px-4 sm:py-3">
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

			<p className={`mt-2 text-center text-xs sm:text-sm ${DEALER_PHASE_CLASSES[gameStatus]}`} role="status" aria-live={isDealerTurn ? "polite" : "off"}>
				{DEALER_PHASE_MESSAGES[gameStatus]}
			</p>
		</section>
	);
};

export default DealerSurface;
