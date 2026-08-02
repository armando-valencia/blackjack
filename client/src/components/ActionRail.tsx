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
		<section aria-label="Round actions" className="sticky bottom-0 z-30 bg-table-surface-raised/90 backdrop-blur-xl border border-table-border/30 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:p-5 md:pb-5">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<p className="text-table-subtle text-xs font-medium tracking-[0.2em] uppercase">Round actions</p>
					<p className="text-table-muted text-sm mt-1" aria-live="polite">{getActionMessage()}</p>
				</div>
				<div className="flex justify-center lg:justify-end">{renderAction()}</div>
			</div>

			{gameStatus === GAME_STATUS.GAME_OVER && (
				<div className="mt-4 grid grid-cols-3 gap-2 border-t border-table-border/20 pt-4 text-center">
					<div>
						<p className="text-table-subtle text-xs uppercase tracking-wider">Dealer</p>
						<p className="text-table-text font-semibold">{dealerScore}</p>
					</div>
					<div>
						<p className="text-table-subtle text-xs uppercase tracking-wider">You</p>
						<p className="text-table-text font-semibold">{playerScore ?? "—"}</p>
					</div>
					<div>
						<p className="text-table-subtle text-xs uppercase tracking-wider">Result</p>
						<p className="text-table-active font-semibold">{playerResult ? RESULT_LABELS[playerResult] : "Round over"}</p>
					</div>
				</div>
			)}
		</section>
	);
};

export default ActionRail;
