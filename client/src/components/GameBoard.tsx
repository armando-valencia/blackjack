import React from "react";
import Card from "./Card";
import GameMessage from "./GameMessage";
import GameControls from "./GameControls";
import PlayerCard from "./PlayerCard";
import type { MultiplayerGameState } from "../interfaces/game_interfaces";

interface GameBoardProps {
	game: MultiplayerGameState;
	onDeal: () => void;
	onHit: () => void;
	onStand: () => void;
	isActionPending: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, onDeal, onHit, onStand, isActionPending }) => {
	const humanPlayer = game.players.find((p) => p.is_human);
	const botPlayers = game.players.filter((p) => !p.is_human);
	const isHumanTurn = humanPlayer && game.current_player_index === humanPlayer.player_id;

	return (
		<div className="max-w-4xl mx-auto">
			<div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/30 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
				{/* Dealer Section */}
				<div className="bg-slate-800/30 border-b border-slate-700/30 p-4 md:p-5">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-slate-400 text-sm font-medium tracking-wider uppercase">Dealer</h3>
						<div className="px-3 py-1 bg-slate-900/60 border border-slate-600/50 rounded-md">
							<span className="text-white font-bold">{game.dealer_score}</span>
						</div>
					</div>
					<div className="flex justify-center">
						<div className="flex gap-2 md:gap-3">
							{game.dealer_hand.map((cardString, index) => (
								<Card key={`dealer-${cardString}-${index}`} card={cardString} index={index} />
							))}
						</div>
					</div>
				</div>

				{/* Message Section */}
				{game.message && (
					<div className="bg-slate-900/20 border-y border-slate-700/20 px-4 md:px-6 py-2.5">
						<GameMessage
							message={game.message}
							gameStatus={game.game_status}
							result={humanPlayer?.result || null}
						/>
					</div>
				)}

				{/* Players Section */}
				<div className="p-4 md:p-5">
					{/* Bot Players - Compact on mobile, grid on desktop */}
					{botPlayers.length > 0 && (
						<div className="mb-4 space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:gap-4">
							{botPlayers.map((player) => (
								<PlayerCard
									key={player.player_id}
									player={player}
									isCurrentTurn={game.current_player_index === player.player_id}
									variant={botPlayers.length > 2 ? "compact" : "full"}
								/>
							))}
						</div>
					)}

					{/* Human Player */}
					{humanPlayer && (
						<div className="mb-4">
							<PlayerCard
								player={humanPlayer}
								isCurrentTurn={isHumanTurn || false}
								variant="full"
							/>
						</div>
					)}

					{/* Game Controls */}
					<div className="flex justify-center">
						<div className="w-full max-w-md">
							<GameControls
								gameStatus={game.game_status}
								onDeal={onDeal}
								onHit={onHit}
								onStand={onStand}
								isHumanTurn={isHumanTurn || false}
								isActionPending={isActionPending}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameBoard;
