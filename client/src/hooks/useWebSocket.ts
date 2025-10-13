import { useEffect, useState } from "react";
import type { MultiplayerGameState, ControlMessage, ServerMessage } from "../interfaces/game_interfaces";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface UseWebSocketReturn {
	game: MultiplayerGameState | null;
	connectionStatus: ConnectionStatus;
	errorMessage: string | null;
	sendControlMessage: (type: ControlMessage["type"], numPlayers?: number) => void;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
	const [game, setGame] = useState<MultiplayerGameState | null>(null);
	const [websocket, setWebsocket] = useState<WebSocket | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		console.log("Attempting to connect to WebSocket...");
		setConnectionStatus("connecting");
		setErrorMessage(null);
		const ws = new WebSocket(url);

		ws.onopen = () => {
			console.log("WebSocket connected");
			setConnectionStatus("connected");
			setErrorMessage(null);
		};

		ws.onmessage = (event: MessageEvent) => {
			console.log("Message from server:", event.data);

			try {
				const serverMessage: ServerMessage = JSON.parse(event.data);

				if (serverMessage.type === "game_state" || serverMessage.type === "game_over") {
					setGame(serverMessage);
					setErrorMessage(null);
				} else if (serverMessage.type === "error") {
					console.error("Server Error:", serverMessage.message);
					setErrorMessage(serverMessage.message);
				}
			} catch (error) {
				console.error("Failed to parse message from server:", event.data, error);
				setErrorMessage("Failed to parse server message");
			}
		};

		ws.onerror = () => {
			console.error("WebSocket error: See console for details.");
			setConnectionStatus("error");
			setErrorMessage("Connection error. Please ensure the server is running.");
		};

		ws.onclose = (event: CloseEvent) => {
			console.log("WebSocket connection closed:", event.code, event.reason);
			setWebsocket(null);
			setConnectionStatus("disconnected");
			if (event.code !== 1000) {
				setErrorMessage("Connection lost. Please refresh the page.");
			}
		};

		setWebsocket(ws);

		return () => {
			console.log("Cleaning up WebSocket connection...");
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
				console.log("WebSocket connection closed by cleanup");
			}
		};
	}, [url]);

	const sendControlMessage = (type: ControlMessage["type"], numPlayers?: number) => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			const message: ControlMessage = { type, ...(numPlayers && { num_players: numPlayers }) };
			console.log("Sending message:", message);
			websocket.send(JSON.stringify(message));
		} else {
			console.error("WebSocket is not connected.");
		}
	};

	return {
		game,
		connectionStatus,
		errorMessage,
		sendControlMessage,
	};
};
