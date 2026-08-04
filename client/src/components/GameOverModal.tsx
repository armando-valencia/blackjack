import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { GAME_RESULT } from "../constants";
import type { GameResult, PlayerState } from "../interfaces/game_interfaces";

interface GameOverModalProps {
	dealerScore: number;
	players: readonly PlayerState[];
	onPlayAgain: () => void;
	onReturnToMenu: () => void;
	isActionPending: boolean;
}

interface ResultCopy {
	heading: string;
	description: string;
}

const RESULT_COPY: Record<GameResult, ResultCopy> = {
	[GAME_RESULT.WIN]: {
		heading: "You win",
		description: "Your hand beat the dealer.",
	},
	[GAME_RESULT.LOSE]: {
		heading: "Dealer wins",
		description: "The dealer took the round.",
	},
	[GAME_RESULT.PUSH]: {
		heading: "Push",
		description: "The hands finished with the same score.",
	},
};

const getResultCopy = (result: GameResult | null): ResultCopy =>
	result ? RESULT_COPY[result] : { heading: "Round complete", description: "The round has finished." };

const getPlayerResultLabel = (player: PlayerState): string => {
	if (!player.result) return "Round complete";
	if (player.result === GAME_RESULT.WIN) return player.is_human ? "You win" : "Wins";
	if (player.result === GAME_RESULT.LOSE) return player.is_human ? "You lose" : "Loses";
	return "Push";
};

const GameOverModal = ({
	dealerScore,
	players,
	onPlayAgain,
	onReturnToMenu,
	isActionPending,
}: GameOverModalProps) => {
	const playAgainButtonRef = useRef<HTMLButtonElement>(null);

	const humanPlayer = players.find((player) => player.is_human) ?? null;
	const botPlayers = players.filter((player) => !player.is_human);
	const resultCopy = getResultCopy(humanPlayer?.result ?? null);

	useEffect(() => {
		const previouslyFocusedElement = document.activeElement;
		const previousBodyOverflow = document.body.style.overflow;

		document.body.style.overflow = "hidden";
		playAgainButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onReturnToMenu();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousBodyOverflow;
			document.removeEventListener("keydown", handleKeyDown);
			if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
		};
	}, [onReturnToMenu]);

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="presentation">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="game-over-title"
				aria-describedby="game-over-description"
				className="w-full max-w-lg rounded-xl border-2 border-table-border bg-table-surface p-5 shadow-2xl sm:p-7"
			>
				<div className="text-center">
					<p className="text-table-active text-xs font-semibold uppercase tracking-[0.2em]">Round over</p>
					<h2 id="game-over-title" className="mt-2 font-serif text-3xl font-semibold text-table-text">
						{resultCopy.heading}
					</h2>
					<p id="game-over-description" className="mt-1 text-sm text-table-muted">
						{resultCopy.description}
					</p>
				</div>

				<dl className="mt-5 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
					<div className="rounded-md border border-table-border/50 bg-table-surface-raised/50 p-3">
						<dt className="text-table-subtle text-xs uppercase tracking-wide">Dealer</dt>
						<dd className="mt-1 text-2xl font-bold text-table-text">{dealerScore}</dd>
					</div>
					<div className="rounded-md border border-table-border/50 bg-table-surface-raised/50 p-3">
						<dt className="text-table-subtle text-xs uppercase tracking-wide">You</dt>
						<dd className="mt-1 text-2xl font-bold text-table-active">{humanPlayer?.score ?? "—"}</dd>
					</div>
					<div className="col-span-2 rounded-md border border-table-border/50 bg-table-surface-raised/50 p-3 sm:col-span-1">
						<dt className="text-table-subtle text-xs uppercase tracking-wide">Result</dt>
						<dd className="mt-1 font-semibold text-table-active">{humanPlayer ? getPlayerResultLabel(humanPlayer) : "Round complete"}</dd>
					</div>
				</dl>

				{botPlayers.length > 0 && (
					<section aria-labelledby="opponent-results-title" className="mt-5 border-t border-table-border/30 pt-4">
						<h3 id="opponent-results-title" className="text-table-muted text-xs font-semibold uppercase tracking-wide">
							Other players
						</h3>
						<ul className="mt-2 grid gap-2 sm:grid-cols-2" aria-label="Other player results">
							{botPlayers.map((player) => (
								<li key={player.player_id} className="flex items-center justify-between rounded border border-table-border/30 bg-table-surface-raised/30 px-3 py-2 text-sm">
									<span className="text-table-text">{player.name}</span>
									<span className="text-table-muted">{getPlayerResultLabel(player)}</span>
								</li>
							))}
						</ul>
					</section>
				)}

				<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<button
						type="button"
						onClick={onReturnToMenu}
						disabled={isActionPending}
						className="min-h-11 rounded-md border border-table-border/60 px-5 py-2.5 font-semibold text-table-text transition-colors hover:bg-table-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
					>
						Back to Main Menu
					</button>
					<button
						ref={playAgainButtonRef}
						type="button"
						onClick={onPlayAgain}
						disabled={isActionPending}
						className="min-h-11 rounded-md bg-table-active px-5 py-2.5 font-semibold text-table-page-start transition-colors hover:bg-[#f6d676] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isActionPending ? "Starting..." : "Play Again"}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default GameOverModal;
