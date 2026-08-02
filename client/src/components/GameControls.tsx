import React from "react";
import Button from "./Button";
import { BUTTON_VARIANT, GAME_STATUS } from "../constants";
import type { GameStatus } from "../interfaces/game_interfaces";

interface GameControlsProps {
	gameStatus: GameStatus;
	onDeal: () => void;
	onHit: () => void;
	onStand: () => void;
	isHumanTurn: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ gameStatus, onDeal, onHit, onStand, isHumanTurn }) => {
	if (gameStatus === GAME_STATUS.WAITING) {
		return (
			<div className="flex justify-center">
				<Button onClick={onDeal} variant={BUTTON_VARIANT.DEAL}>
					Deal New Hand
				</Button>
			</div>
		);
	}

	if (gameStatus === GAME_STATUS.PLAYING && isHumanTurn) {
		return (
			<div className="flex flex-col sm:flex-row justify-center gap-3">
				<Button onClick={onHit} variant={BUTTON_VARIANT.HIT}>
					Hit
				</Button>
				<Button onClick={onStand} variant={BUTTON_VARIANT.STAND}>
					Stand
				</Button>
			</div>
		);
	}

	if (gameStatus === GAME_STATUS.GAME_OVER) {
		return (
			<div className="flex justify-center">
				<Button onClick={onDeal} variant={BUTTON_VARIANT.DEAL}>
					Play Again
				</Button>
			</div>
		);
	}

	return null;
};

export default GameControls;
