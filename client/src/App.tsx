import { useEffect, useState } from "react";
import "./App.css";
import type {
	GameState,
	GameOverState,
	// ErrorMessage,
	ControlMessage,
	ServerMessage,
} from "./interfaces/game_interfaces";
import Hand from "./components/Hand";

function App() {
	const [game, setGame] = useState<GameState | GameOverState | null>(null);
	const [websocket, setWebsocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		console.log("Attempting to connect to WebSocket...");
		const ws = new WebSocket("ws://localhost:8765");

		ws.onmessage = (event: MessageEvent) => {
			console.log("Message from server:", event.data);

			try {
				const serverMessage: ServerMessage = JSON.parse(event.data);

				if (serverMessage.type === "game_state" || serverMessage.type === "game_over") {
					// If it's a game state update, set the game state
					setGame(serverMessage);
				} else if (serverMessage.type === "error") {
					console.error("Server Error:", serverMessage.message);
				}
			} catch (error) {
				console.error("Failed to parse message from server:", event.data, error);
			}
		};

		ws.onerror = () => {
			console.error("WebSocket error: See console for details.");
		};

		ws.onclose = (event: CloseEvent) => {
			console.log("WebSocket connection closed:", event.code, event.reason);
			setWebsocket(null);
		};

		setWebsocket(ws);

		return () => {
			console.log("Cleaning up WebSocket connection...");
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
				console.log("WebSocket connection closed by cleanup");
			}
		};
	}, []);

	const sendControlMessage = (type: ControlMessage["type"]) => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			const message: ControlMessage = { type };
			console.log("Sending message:", message);
			// Send the message as a JSON string
			websocket.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not connected.");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-3xl font-bold mb-4">Blackjack</h1> {/* Connection Status */}
			{!websocket || websocket.readyState !== WebSocket.OPEN ? (
				<p className="mt-2 text-center text-red-500">
					Not connected. Ensure the Python server is running.
				</p>
			) : null}
			{/* Game Area - Only show if game state exists */}
			{game ? (
				<div className="w-full max-w-md bg-white p-6 rounded shadow-md text-center">
					{/* dealer's hand */}
					<Hand
						cards={game.dealer_hand}
						score={game.dealer_score}
						label="Dealer's Hand"
					/>

					{/* Game Message */}
					{game.message && (
						<p
							className={`text-lg font-medium mb-4 ${
								game.game_status === "game_over" && game.result === "win"
									? "text-green-600"
									: game.game_status === "game_over" && game.result === "lose"
									? "text-red-600"
									: game.game_status === "game_over" && game.result === "push"
									? "text-blue-600"
									: ""
							}`}
						>
							{game.message}
						</p>
					)}

					{/* player's hand */}
					<Hand
						cards={game.player_hand}
						score={game.player_score}
						label="Player's Hand"
					/>

					{/* Game Controls */}
					{game.game_status === "waiting" && (
						<button
							onClick={() => sendControlMessage("deal_initial")} // Call the new function
							className="p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
						>
							Deal New Hand
						</button>
					)}

					{game.game_status === "player_turn" && (
						<div className="flex justify-center space-x-4">
							<button
								onClick={() => sendControlMessage("hit")} // Call the new function
								className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
							>
								Hit
							</button>
							<button
								onClick={() => sendControlMessage("stand")} // Call the new function
								className="p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring focus::border-red-300"
							>
								Stand
							</button>
						</div>
					)}

					{game.game_status === "game_over" && (
						<button
							onClick={() => sendControlMessage("deal_initial")} // Call the new function
							className="p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 mt-4"
						>
							Play Again
						</button>
					)}
				</div>
			) : (
				<p>Waiting for game state...</p>
			)}
		</div>
	);
}

export default App;
