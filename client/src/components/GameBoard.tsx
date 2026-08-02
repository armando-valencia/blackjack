import React from "react";
import DealerSurface from "./DealerSurface";
import GameMessage from "./GameMessage";
import ActionRail from "./ActionRail";
import PlayerCard from "./PlayerCard";
import { GAME_STATUS } from "../constants";
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
	const isHumanTurn = game.game_status === GAME_STATUS.PLAYING && humanPlayer && game.current_player_index === humanPlayer.player_id;

	return (
		<section aria-label="Game table" className="mx-auto w-full max-w-4xl min-w-0">
			<div className="w-full min-w-0 overflow-hidden rounded-xl border-2 border-table-border/70 bg-table-surface shadow-lg">
				<DealerSurface
					dealerHand={game.dealer_hand}
					dealerScore={game.dealer_score}
					gameStatus={game.game_status}
				/>

				{game.message && (
					<div className="border-y border-table-border/30 bg-table-page-start/20 px-3 py-2 sm:px-5">
						<GameMessage
							message={game.message}
							gameStatus={game.game_status}
							result={humanPlayer?.result || null}
						/>
					</div>
				)}

				<div className="p-3 sm:p-4 md:p-5">
					{humanPlayer && (
						<div className="mb-4">
							<PlayerCard
								player={humanPlayer}
								isCurrentTurn={isHumanTurn || false}
								variant="full"
							/>
						</div>
					)}

					{botPlayers.length > 0 && (
						<ul className="mb-3 space-y-1.5" aria-label="Other players">
							{botPlayers.map((player) => (
								<li key={player.player_id}>
									<PlayerCard
										player={player}
										isCurrentTurn={game.game_status === GAME_STATUS.PLAYING && game.current_player_index === player.player_id}
										variant="compact"
									/>
								</li>
							))}
						</ul>
						)}

				</div>

			<ActionRail
				gameStatus={game.game_status}
				dealerScore={game.dealer_score}
				playerScore={humanPlayer?.score ?? null}
				playerResult={humanPlayer?.result ?? null}
				currentPlayerName={game.players.find((player) => player.player_id === game.current_player_index)?.name ?? null}
				onDeal={onDeal}
				onHit={onHit}
				onStand={onStand}
				isHumanTurn={isHumanTurn || false}
				isActionPending={isActionPending}
			/>
			</div>
		</section>
	);
};

export default GameBoard;
