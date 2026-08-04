import "./index.css";
import { useWebSocket } from "./hooks/useWebSocket";
import ConnectionStatus from "./components/ConnectionStatus";
import ErrorToast from "./components/ErrorToast";
import GameBoard from "./components/GameBoard";
import PlayerSelect from "./components/PlayerSelect";
import { CONTROL_MESSAGE_TYPE, GAME_STATUS } from "./constants";

function App() {
	const { game, connectionStatus, errorMessage, isActionPending, sendControlMessage } = useWebSocket("ws://localhost:8765");

	const handlePlayerCountSelect = (count: number) => {
		sendControlMessage(CONTROL_MESSAGE_TYPE.SET_PLAYER_COUNT, count);
	};

	const showPlayerSelect = game && game.game_status === GAME_STATUS.WAITING && game.players.length === 0;
	const showGameBoard = game && game.players.length > 0;

	return (
		<div className="h-dvh w-full overflow-hidden bg-table-page-start px-2 py-2 sm:px-5 sm:py-4">
			<ConnectionStatus status={connectionStatus} hasError={!!errorMessage} />
			<ErrorToast message={errorMessage} />

			<main className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl min-w-0 flex-col">
				<header className="mb-2 shrink-0 border-b border-table-border/50 pb-2 text-center sm:mb-3 sm:pb-3">
					<h1 className="font-serif text-2xl font-semibold tracking-[0.08em] text-table-text sm:text-4xl">
						BLACKJACK
					</h1>
				</header>

				{showPlayerSelect && (
					<div className="flex min-h-0 flex-1 items-center justify-center">
						<PlayerSelect onSelectPlayerCount={handlePlayerCountSelect} isActionPending={isActionPending} />
					</div>
				)}

				{showGameBoard && (
					<div className="min-h-0 flex-1">
						<GameBoard
							game={game}
							onDeal={() => sendControlMessage(CONTROL_MESSAGE_TYPE.DEAL_INITIAL)}
							onRestart={() => sendControlMessage(CONTROL_MESSAGE_TYPE.RESTART_HAND)}
							onReturnToMenu={() => sendControlMessage(CONTROL_MESSAGE_TYPE.RETURN_TO_MENU)}
							onHit={() => sendControlMessage(CONTROL_MESSAGE_TYPE.HIT)}
							onStand={() => sendControlMessage(CONTROL_MESSAGE_TYPE.STAND)}
							isActionPending={isActionPending}
						/>
					</div>
				)}

				{!game && (
					<div className="flex min-h-0 flex-1 items-center justify-center" role="status" aria-live="polite">
						<div className="rounded-md border border-table-border/60 bg-table-surface px-5 py-3 shadow-sm">
							<p className="text-table-muted text-base">Connecting to server...</p>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
