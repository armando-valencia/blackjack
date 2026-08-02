import { useEffect, useRef, useState } from "react";
import { CONNECTION_STATUS, SERVER_MESSAGE_TYPE } from "../constants";
import type {
	ConnectionStatus,
	ControlMessage,
	ControlMessageType,
	MultiplayerGameState,
	ServerMessage,
} from "../interfaces/game_interfaces";

interface UseWebSocketReturn {
	game: MultiplayerGameState | null;
	connectionStatus: ConnectionStatus;
	errorMessage: string | null;
	isActionPending: boolean;
	sendControlMessage: (type: ControlMessage["type"], numPlayers?: number) => void;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY_MS = 500;
const MAX_RECONNECT_DELAY_MS = 4000;

export const useWebSocket = (url: string): UseWebSocketReturn => {
	const [game, setGame] = useState<MultiplayerGameState | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(CONNECTION_STATUS.CONNECTING);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isActionPending, setIsActionPending] = useState(false);
	const websocketRef = useRef<WebSocket | null>(null);
	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const reconnectAttemptRef = useRef(0);

	useEffect(() => {
		let isActive = true;
		reconnectAttemptRef.current = 0;

		const scheduleReconnect = () => {
			if (!isActive || reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
				setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
				setErrorMessage("Unable to reconnect. Please try again later.");
				return;
			}

			reconnectAttemptRef.current += 1;
			const reconnectDelay = Math.min(
				INITIAL_RECONNECT_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1),
				MAX_RECONNECT_DELAY_MS,
			);
			setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
			setErrorMessage("Connection lost. Reconnecting...");
			reconnectTimerRef.current = setTimeout(connect, reconnectDelay);
		};

		const connect = () => {
			if (!isActive) return;

			setConnectionStatus(
				reconnectAttemptRef.current === 0
					? CONNECTION_STATUS.CONNECTING
					: CONNECTION_STATUS.RECONNECTING,
			);
			const websocket = new WebSocket(url);
			websocketRef.current = websocket;

			websocket.onopen = () => {
				reconnectAttemptRef.current = 0;
				setConnectionStatus(CONNECTION_STATUS.CONNECTED);
				setErrorMessage(null);
			};

			websocket.onmessage = (event: MessageEvent) => {
				try {
					const serverMessage: ServerMessage = JSON.parse(event.data);

					if (
						serverMessage.type === SERVER_MESSAGE_TYPE.GAME_STATE ||
						serverMessage.type === SERVER_MESSAGE_TYPE.GAME_OVER
					) {
						setGame(serverMessage);
					} else if (serverMessage.type === SERVER_MESSAGE_TYPE.ERROR) {
						setIsActionPending(false);
						setErrorMessage(serverMessage.message);
					} else if (serverMessage.type === SERVER_MESSAGE_TYPE.ACTION_RESULT) {
						setIsActionPending(false);
						setErrorMessage(serverMessage.accepted ? null : serverMessage.message);
					}
				} catch {
					setIsActionPending(false);
					setErrorMessage("Failed to parse server message");
				}
			};

			websocket.onerror = () => {
				setErrorMessage("Connection error. Retrying...");
			};

			websocket.onclose = () => {
				if (websocketRef.current === websocket) {
					websocketRef.current = null;
				}
				setIsActionPending(false);
				scheduleReconnect();
			};
		};

		connect();

		return () => {
			isActive = false;
			if (reconnectTimerRef.current) {
				clearTimeout(reconnectTimerRef.current);
			}
			if (websocketRef.current) {
				websocketRef.current.close();
			}
		};
	}, [url]);

	const sendControlMessage = (type: ControlMessageType, numPlayers?: number) => {
		const websocket = websocketRef.current;
		if (websocket && websocket.readyState === WebSocket.OPEN && !isActionPending) {
			const message: ControlMessage = { type, ...(numPlayers && { num_players: numPlayers }) };
			setIsActionPending(true);
			try {
				websocket.send(JSON.stringify(message));
			} catch {
				setIsActionPending(false);
				setErrorMessage("Unable to send command. Please try again.");
			}
		}
	};

	return {
		game,
		connectionStatus,
		errorMessage,
		isActionPending,
		sendControlMessage,
	};
};
