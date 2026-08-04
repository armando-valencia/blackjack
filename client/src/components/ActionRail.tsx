import React from "react";
import Button from "./Button";
import { BUTTON_VARIANT, GAME_STATUS } from "../constants";
import type { GameStatus } from "../interfaces/game_interfaces";

interface ActionRailProps {
	gameStatus: GameStatus;
	currentPlayerName: string | null;
	onDeal: () => void;
	onHit: () => void;
	onStand: () => void;
	isHumanTurn: boolean;
	isActionPending: boolean;
}

const ActionRail: React.FC<ActionRailProps> = ({
	gameStatus,
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

		return <p className="text-table-muted text-sm text-center px-4 py-3">{getActionMessage()}</p>;
	};

	return (
		<section aria-label="Round actions" className="shrink-0 sticky bottom-0 z-30 border-t border-table-border/50 bg-table-surface-raised/80 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:static md:px-4 md:py-3 md:pb-3">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-table-text text-sm font-semibold">Your move</p>
					<p className="mt-0.5 text-[0.7rem] text-table-muted" aria-live="polite">{getActionMessage()}</p>
				</div>
				<div className="flex justify-center sm:justify-end">{renderAction()}</div>
			</div>
		</section>
	);
};

export default ActionRail;
