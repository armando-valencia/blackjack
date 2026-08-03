import React from "react";

interface GameNavigationProps {
	onRestart: () => void;
	onReturnToMenu: () => void;
	isActionPending: boolean;
}

const NAVIGATION_BUTTON_CLASSES =
	"min-h-10 rounded border border-table-border/60 px-3 py-2 text-xs font-semibold text-table-text transition-colors hover:border-table-active hover:bg-table-surface-raised disabled:cursor-not-allowed disabled:opacity-50 sm:px-4";

const GameNavigation: React.FC<GameNavigationProps> = ({ onRestart, onReturnToMenu, isActionPending }) => {
	return (
		<nav aria-label="Game navigation" className="flex items-center justify-end gap-2 border-b border-table-border/40 px-3 py-2 sm:px-5">
			<button type="button" onClick={onRestart} disabled={isActionPending} className={NAVIGATION_BUTTON_CLASSES}>
				New Game
			</button>
			<button type="button" onClick={onReturnToMenu} disabled={isActionPending} className={NAVIGATION_BUTTON_CLASSES}>
				Main Menu
			</button>
		</nav>
	);
};

export default GameNavigation;
