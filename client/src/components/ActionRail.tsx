import React from "react";
import Button from "./Button";
import { BUTTON_VARIANT, GAME_RESULT, GAME_STATUS } from "../constants";
import type { GameResult, GameStatus } from "../interfaces/game_interfaces";

interface ActionRailProps {
	gameStatus: GameStatus;
	dealerScore: number;
	playerScore: number | null;
	playerResult: GameResult | null;
	currentPlayerName: string | null;
	onDeal: () => void;
	onHit: () => void;
	onStand: () => void;
	isHumanTurn: boolean;
	isActionPending: boolean;
}

const RESULT_LABELS: Record<GameResult, string> = {
	[GAME_RESULT.WIN]: "You win",
	[GAME_RESULT.LOSE]: "You lose",
	[GAME_RESULT.PUSH]: "Push",
};

const ActionRail: React.FC<ActionRailProps> = ({
	gameStatus,
	dealerScore,
	playerScore,
	playerResult,
	currentPlayerName,
	onDeal,
	onHit,
	onStand,
	isHumanTurn,
	isActionPending,
}) => {
	const getActionMessage = () => {
		if (gameStatus === GAME_STATUS.WAITING) return "Start a new round when everyone is ready.";
		if (gameStatus === GAME_STATUS.PLAYING && isHumanTurn) return "Choose whether to take another card or keep your hand.";
		if (gameStatus === GAME_STATUS.PLAYING) return `Waiting for ${currentPlayerName || "the next player"} to act.`;
		if (gameStatus === GAME_STATUS.DEALER_TURN) return "The dealer is finishing the round.";
		return "Review the round, then play again when ready.";
	};

	const renderAction = () => {
		if (gameStatus === GAME_STATUS.WAITING) {
			return (
				<Button onClick={onDeal} variant={BUTTON_VARIANT.DEAL} disabled={isActionPending}>
					{isActionPending ? "Dealing..." : "Deal New Hand"}
				</Button>
			);
		}

		if (gameStatus === GAME_STATUS.PLAYING && isHumanTurn) {
			return (
				<div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
					<Button onClick={onHit} variant={BUTTON_VARIANT.HIT} disabled={isActionPending}>
						{isActionPending ? "Working..." : "Hit"}
					</Button>
					<Button onClick={onStand} variant={BUTTON_VARIANT.STAND} disabled={isActionPending}>
						Stand
					</Button>
				</div>
			);
		}

		if (gameStatus === GAME_STATUS.GAME_OVER) {
			return (
				<Button onClick={onDeal} variant={BUTTON_VARIANT.DEAL} disabled={isActionPending}>
					{isActionPending ? "Dealing..." : "Play Again"}
				</Button>
			);
		}

		return <p className="text-table-muted text-sm text-center px-4 py-3">{getActionMessage()}</p>;
	};

	return (
		<section aria-label="Round actions" className="sticky bottom-0 z-30 border-t border-table-border/50 bg-table-surface-raised/80 px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:static md:px-5 md:py-4 md:pb-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-table-text text-sm font-semibold">Your move</p>
					<p className="mt-0.5 text-xs text-table-muted" aria-live="polite">{getActionMessage()}</p>
				</div>
				<div className="flex justify-center sm:justify-end">{renderAction()}</div>
			</div>

			{gameStatus === GAME_STATUS.GAME_OVER && (
				<dl className="mt-3 grid grid-cols-3 gap-2 border-t border-table-border/30 pt-3 text-center">
					<div>
						<dt className="text-table-subtle text-[0.65rem] uppercase tracking-wide">Dealer</dt>
						<dd className="text-table-text font-semibold">{dealerScore}</dd>
					</div>
					<div>
						<dt className="text-table-subtle text-[0.65rem] uppercase tracking-wide">You</dt>
						<dd className="text-table-text font-semibold">{playerScore ?? "—"}</dd>
					</div>
					<div>
						<dt className="text-table-subtle text-[0.65rem] uppercase tracking-wide">Result</dt>
						<dd className="text-table-active font-semibold">{playerResult ? RESULT_LABELS[playerResult] : "Round over"}</dd>
					</div>
				</dl>
			)}
		</section>
	);
};

export default ActionRail;
