import React from "react";
import Button from "./Button";

interface GameControlsProps {
	gameStatus: "waiting" | "playing" | "dealer_turn" | "game_over";
	onDeal: () => void;
	onHit: () => void;
	onStand: () => void;
	isHumanTurn: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ gameStatus, onDeal, onHit, onStand, isHumanTurn }) => {
	if (gameStatus === "waiting") {
		return (
			<div className="flex justify-center">
				<Button onClick={onDeal} variant="deal">
					Deal New Hand
				</Button>
			</div>
		);
	}

	if (gameStatus === "playing" && isHumanTurn) {
		return (
			<div className="flex flex-col sm:flex-row justify-center gap-3">
				<Button onClick={onHit} variant="hit">
					Hit
				</Button>
				<Button onClick={onStand} variant="stand">
					Stand
				</Button>
			</div>
		);
	}

	if (gameStatus === "game_over") {
		return (
			<div className="flex justify-center">
				<Button onClick={onDeal} variant="deal">
					Play Again
				</Button>
			</div>
		);
	}

	return null;
};

export default GameControls;
