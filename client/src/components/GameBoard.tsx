import React from "react";
import DealerSurface from "./DealerSurface";
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
			<div className="bg-table-surface/40 backdrop-blur-xl border border-table-border/30 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
				<DealerSurface
					dealerHand={game.dealer_hand}
					dealerScore={game.dealer_score}
					gameStatus={game.game_status}
				/>

				{game.message && (
					<div className="bg-table-surface/20 border-y border-table-border/20 px-4 md:px-6 py-2.5">
						<GameMessage
							message={game.message}
							gameStatus={game.game_status}
							result={humanPlayer?.result || null}
						/>
					</div>
				)}

				<div className="p-4 md:p-5">
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

					{humanPlayer && (
						<div className="mb-4">
							<PlayerCard
								player={humanPlayer}
								isCurrentTurn={isHumanTurn || false}
								variant="full"
							/>
						</div>
					)}

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
