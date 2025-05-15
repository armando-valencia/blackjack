import { useEffect, useState } from "react";
import "./App.css";

import type {
	GameState,
	GameOverState,
	// ErrorMessage,
	ControlMessage,
	ServerMessage,
} from "./interfaces/game_interfaces";

// type Message = string;

function App() {
	const [messages, setMessages] = useState<string[]>([]); // Keep for raw message log if you like
	// New state to hold the game state received from the server, typed appropriately
	const [game, setGame] = useState<GameState | GameOverState | null>(null);
	const [websocket, setWebsocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		console.log("Attempting to connect to WebSocket...");
		const ws = new WebSocket("ws://localhost:8765");

		ws.onopen = () => {
			console.log("WebSocket connection established");
			setMessages((prevMessages) => [
				...prevMessages,
				"Connected to server",
			]);
		};

		ws.onmessage = (event: MessageEvent) => {
			console.log("Message from server:", event.data);
			// Add the raw message to the general log
			setMessages((prevMessages) => [
				...prevMessages,
				`Server: ${event.data}`,
			]);

			try {
				// Attempt to parse the incoming message as one of our defined server messages
				const serverMessage: ServerMessage = JSON.parse(event.data);

				if (
					serverMessage.type === "game_state" ||
					serverMessage.type === "game_over"
				) {
					// If it's a game state update, set the game state
					setGame(serverMessage);
				} else if (serverMessage.type === "error") {
					// If it's an error message
					console.error("Server Error:", serverMessage.message);
					setMessages((prevMessages) => [
						...prevMessages,
						`Server Error: ${serverMessage.message}`,
					]);
				}
				// TODO: Handle other potential message types if you add them later
			} catch (error) {
				console.error(
					"Failed to parse message from server:",
					event.data,
					error
				);
				setMessages((prevMessages) => [
					...prevMessages,
					`Error parsing message: ${event.data}`,
				]);
			}
		};

		ws.onerror = () => {
			console.error("WebSocket error: See console for details.");
			setMessages((prevMessages) => [
				...prevMessages,
				`WebSocket Error: See console for details.`,
			]);
		};

		ws.onclose = (event: CloseEvent) => {
			console.log(
				"WebSocket connection closed:",
				event.code,
				event.reason
			);
			setMessages((prevMessages) => [
				...prevMessages,
				"Disconnected from server",
			]);
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
			// Optionally add the sent message to the log
			setMessages((prevMessages) => [
				...prevMessages,
				`Client: ${JSON.stringify(message)}`,
			]);
		} else {
			console.error("WebSocket is not connected.");
			setMessages((prevMessages) => [
				...prevMessages,
				"Error: Not connected to server",
			]);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<h1 className="text-3xl font-bold mb-4">Blackjack</h1>{" "}
			{/* Updated title */}
			{/* Connection Status */}
			{!websocket || websocket.readyState !== WebSocket.OPEN ? (
				<p className="mt-2 text-center text-red-500">
					Not connected. Ensure the Python server is running.
				</p>
			) : null}
			{/* Game Area - Only show if game state exists */}
			{game ? (
				<div className="w-full max-w-md bg-white p-6 rounded shadow-md text-center">
					{/* Dealer's Hand */}
					<div className="mb-4">
						<h2 className="text-xl font-semibold">
							Dealer's Hand (
							{game.game_status === "game_over"
								? game.dealer_score
								: game.dealer_score}
							)
						</h2>{" "}
						{/* You might show 0 or just 'Dealer' if not revealed */}
						<div className="flex justify-center space-x-2 mt-2">
							{game.dealer_hand.map((cardStr, index) => (
								// Basic card representation
								<div
									key={index}
									className={`p-2 border rounded ${
										cardStr === "Hidden"
											? "bg-gray-300"
											: "bg-white"
									}`}
								>
									{cardStr}
								</div>
							))}
						</div>
					</div>

					{/* Game Message */}
					{game.message && (
						<p
							className={`text-lg font-medium mb-4 ${
								game.game_status === "game_over" &&
								game.result === "win"
									? "text-green-600"
									: game.game_status === "game_over" &&
									  game.result === "lose"
									? "text-red-600"
									: game.game_status === "game_over" &&
									  game.result === "push"
									? "text-blue-600"
									: ""
							}`}
						>
							{game.message}
						</p>
					)}

					{/* Player's Hand */}
					<div className="mb-4">
						<h2 className="text-xl font-semibold">
							Your Hand ({game.player_score})
						</h2>
						<div className="flex justify-center space-x-2 mt-2">
							{game.player_hand.map((cardStr, index) => (
								<div
									key={index}
									className="p-2 border rounded bg-white"
								>
									{cardStr}
								</div>
							))}
						</div>
					</div>

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
				<p>Waiting for game state...</p> // Initial state before any game message
			)}
			{/* Raw Message Log (Optional for debugging) */}
			<div className="w-full max-w-md bg-white p-6 rounded shadow-md mt-4">
				<h2 className="text-xl font-semibold mb-2">Message Log</h2>
				<div className="mb-4 h-32 overflow-y-auto border p-2 rounded bg-gray-50 text-xs">
					{messages.map((msg, index) => (
						<p key={index} className="break-words">
							{msg}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
