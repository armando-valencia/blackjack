import React from "react";
import GameMessage from "./GameMessage";
import GameControls from "./GameControls";
import Card from "./Card";
import type { GameState, GameOverState } from "../interfaces/game_interfaces";

interface GameBoardProps {
	game: GameState | GameOverState;
	onDeal: () => void;
	onHit: () => void;
	onStand: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, onDeal, onHit, onStand }) => {
	return (
		<div className="max-w-5xl mx-auto">
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
				<div className="bg-slate-800/30 border-b border-slate-700/30 p-6 md:p-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-slate-400 text-sm font-medium tracking-wider uppercase">
							Dealer
						</h3>
						<div className="px-3 py-1 bg-slate-900/60 border border-slate-600/50 rounded-md">
							<span className="text-white font-bold">{game.dealer_score}</span>
						</div>
					</div>
					<div className="flex justify-center">
						<div className="flex gap-2 md:gap-3">
							{game.dealer_hand.map((cardString, index) => (
								<Card
									key={`dealer-${cardString}-${index}`}
									card={cardString}
									index={index}
								/>
							))}
						</div>
					</div>
				</div>

				{game.message && (
					<div className="bg-slate-900/20 border-y border-slate-700/20 px-6 py-4">
						<GameMessage
							message={game.message}
							gameStatus={game.game_status}
							result={game.result}
						/>
					</div>
				)}

				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-emerald-400 text-sm font-medium tracking-wider uppercase">
							You
						</h3>
						<div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
							<span className="text-emerald-400 font-bold">{game.player_score}</span>
						</div>
					</div>
					<div className="flex justify-center mb-6">
						<div className="flex gap-2 md:gap-3">
							{game.player_hand.map((cardString, index) => (
								<Card
									key={`player-${cardString}-${index}`}
									card={cardString}
									index={index}
								/>
							))}
						</div>
					</div>
					<div className="flex justify-center">
						<div className="w-full max-w-md">
							<GameControls
								gameStatus={game.game_status}
								onDeal={onDeal}
								onHit={onHit}
								onStand={onStand}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameBoard;
