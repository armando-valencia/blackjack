import React from "react";
import DealerSurface from "./DealerSurface";
import GameNavigation from "./GameNavigation";
import GameMessage from "./GameMessage";
import ActionRail from "./ActionRail";
import PlayerCard from "./PlayerCard";
import { GAME_STATUS } from "../constants";
import type { MultiplayerGameState } from "../interfaces/game_interfaces";

interface GameBoardProps {
	game: MultiplayerGameState;
	onDeal: () => void;
	onRestart: () => void;
	onReturnToMenu: () => void;
	onHit: () => void;
	onStand: () => void;
	isActionPending: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ game, onDeal, onRestart, onReturnToMenu, onHit, onStand, isActionPending }) => {
	const humanPlayer = game.players.find((p) => p.is_human);
	const botPlayers = game.players.filter((p) => !p.is_human);
	const isHumanTurn = game.game_status === GAME_STATUS.PLAYING && humanPlayer && game.current_player_index === humanPlayer.player_id;

	return (
		<section aria-label="Game table" className="mx-auto h-full w-full min-w-0">
			<div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border-2 border-table-border/70 bg-table-surface shadow-lg">
				<GameNavigation
					onRestart={onRestart}
					onReturnToMenu={onReturnToMenu}
					isActionPending={isActionPending}
				/>
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

				<div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden p-2 sm:gap-3 sm:p-3 md:grid-cols-[minmax(0,1.6fr)_minmax(12rem,0.9fr)] md:p-4">
					{humanPlayer && (
						<div className="min-h-0">
							<PlayerCard
								player={humanPlayer}
								isCurrentTurn={isHumanTurn || false}
								variant="full"
							/>
						</div>
					)}

					{botPlayers.length > 0 && (
						<ul className="grid min-h-0 grid-cols-2 content-start gap-2 overflow-hidden md:grid-cols-1" aria-label="Other players">
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
