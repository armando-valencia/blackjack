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
		<div className="flex min-h-dvh w-full items-start justify-center overflow-x-hidden bg-table-page-start px-3 py-4 sm:px-6 sm:py-6">
			<ConnectionStatus status={connectionStatus} hasError={!!errorMessage} />
			<ErrorToast message={errorMessage} />

			<main className="relative z-10 w-full max-w-5xl min-w-0">
				<header className="mb-4 border-b border-table-border/50 pb-3 text-center sm:mb-6">
					<h1 className="font-serif text-3xl font-semibold tracking-[0.08em] text-table-text sm:text-4xl">
						BLACKJACK
					</h1>
				</header>

				{showPlayerSelect && <PlayerSelect onSelectPlayerCount={handlePlayerCountSelect} />}

				{showGameBoard && (
					<GameBoard
						game={game}
						onDeal={() => sendControlMessage(CONTROL_MESSAGE_TYPE.DEAL_INITIAL)}
						onRestart={() => sendControlMessage(CONTROL_MESSAGE_TYPE.RESTART_HAND)}
						onReturnToMenu={() => sendControlMessage(CONTROL_MESSAGE_TYPE.RETURN_TO_MENU)}
						onHit={() => sendControlMessage(CONTROL_MESSAGE_TYPE.HIT)}
						onStand={() => sendControlMessage(CONTROL_MESSAGE_TYPE.STAND)}
						isActionPending={isActionPending}
					/>
				)}

				{!game && (
					<div className="flex justify-center" role="status" aria-live="polite">
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
