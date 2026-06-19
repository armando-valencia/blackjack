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
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0e17] via-[#121621] to-[#0a0e17] p-4 md:p-8 relative">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,58,138,0.15),transparent_50%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(15,23,42,0.3),transparent_50%)]" />
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

			<ConnectionStatus status={connectionStatus} hasError={!!errorMessage} />
			<ErrorToast message={errorMessage} />

			<div className="w-full max-w-6xl relative z-10">
				<div className="text-center mb-6 md:mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-white tracking-[0.3em] mb-2">
						BLACKJACK
					</h1>
					<div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
				</div>

				{showPlayerSelect && <PlayerSelect onSelectPlayerCount={handlePlayerCountSelect} />}

				{showGameBoard && (
					<GameBoard
						game={game}
						onDeal={() => sendControlMessage(CONTROL_MESSAGE_TYPE.DEAL_INITIAL)}
						onHit={() => sendControlMessage(CONTROL_MESSAGE_TYPE.HIT)}
						onStand={() => sendControlMessage(CONTROL_MESSAGE_TYPE.STAND)}
						isActionPending={isActionPending}
					/>
				)}

				{!game && (
					<div className="flex justify-center">
						<div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/30 px-8 py-4 rounded-xl">
							<p className="text-slate-400 text-base">Connecting to server...</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
