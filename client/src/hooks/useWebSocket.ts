import { useEffect, useReducer, useRef } from "react";
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

export interface WebSocketState {
	game: MultiplayerGameState | null;
	connectionStatus: ConnectionStatus;
	errorMessage: string | null;
	isActionPending: boolean;
}

export const WEBSOCKET_ACTION = {
	SET_CONNECTION_STATUS: "set_connection_status",
	SET_GAME: "set_game",
	SET_ERROR: "set_error",
	CLEAR_ERROR: "clear_error",
	SET_ACTION_PENDING: "set_action_pending",
	SET_ACTION_RESULT: "set_action_result",
} as const;

export type WebSocketAction =
	| { type: typeof WEBSOCKET_ACTION.SET_CONNECTION_STATUS; status: ConnectionStatus }
	| { type: typeof WEBSOCKET_ACTION.SET_GAME; game: MultiplayerGameState }
	| { type: typeof WEBSOCKET_ACTION.SET_ERROR; message: string }
	| { type: typeof WEBSOCKET_ACTION.CLEAR_ERROR }
	| { type: typeof WEBSOCKET_ACTION.SET_ACTION_PENDING; isPending: boolean }
	| { type: typeof WEBSOCKET_ACTION.SET_ACTION_RESULT; accepted: boolean; message: string };

export const initialWebSocketState: WebSocketState = {
	game: null,
	connectionStatus: CONNECTION_STATUS.CONNECTING,
	errorMessage: null,
	isActionPending: false,
};

const assertUnreachable = (value: never): never => {
	throw new Error(`Unhandled WebSocket action: ${String(value)}`);
};

export const webSocketReducer = (state: WebSocketState, action: WebSocketAction): WebSocketState => {
	switch (action.type) {
		case WEBSOCKET_ACTION.SET_CONNECTION_STATUS:
			return { ...state, connectionStatus: action.status };
		case WEBSOCKET_ACTION.SET_GAME:
			return { ...state, game: action.game };
		case WEBSOCKET_ACTION.SET_ERROR:
			return { ...state, errorMessage: action.message };
		case WEBSOCKET_ACTION.CLEAR_ERROR:
			return { ...state, errorMessage: null };
		case WEBSOCKET_ACTION.SET_ACTION_PENDING:
			return { ...state, isActionPending: action.isPending };
		case WEBSOCKET_ACTION.SET_ACTION_RESULT:
			return {
				...state,
				isActionPending: false,
				errorMessage: action.accepted ? null : action.message,
			};
		default:
			return assertUnreachable(action);
	}
};

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY_MS = 500;
const MAX_RECONNECT_DELAY_MS = 4000;

export const useWebSocket = (url: string): UseWebSocketReturn => {
	const [state, dispatch] = useReducer(webSocketReducer, initialWebSocketState);
	const websocketRef = useRef<WebSocket | null>(null);
	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const reconnectAttemptRef = useRef(0);

	useEffect(() => {
		let isActive = true;
		reconnectAttemptRef.current = 0;

		const scheduleReconnect = () => {
			if (!isActive || reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
				dispatch({ type: WEBSOCKET_ACTION.SET_CONNECTION_STATUS, status: CONNECTION_STATUS.DISCONNECTED });
				dispatch({ type: WEBSOCKET_ACTION.SET_ERROR, message: "Unable to reconnect. Please try again later." });
				return;
			}

			reconnectAttemptRef.current += 1;
			const reconnectDelay = Math.min(
				INITIAL_RECONNECT_DELAY_MS * 2 ** (reconnectAttemptRef.current - 1),
				MAX_RECONNECT_DELAY_MS,
			);
			dispatch({ type: WEBSOCKET_ACTION.SET_CONNECTION_STATUS, status: CONNECTION_STATUS.RECONNECTING });
			dispatch({ type: WEBSOCKET_ACTION.SET_ERROR, message: "Connection lost. Reconnecting..." });
			reconnectTimerRef.current = setTimeout(connect, reconnectDelay);
		};

		const connect = () => {
			if (!isActive) return;

			dispatch({
				type: WEBSOCKET_ACTION.SET_CONNECTION_STATUS,
				status: reconnectAttemptRef.current === 0 ? CONNECTION_STATUS.CONNECTING : CONNECTION_STATUS.RECONNECTING,
			});
			const websocket = new WebSocket(url);
			websocketRef.current = websocket;

			websocket.onopen = () => {
				reconnectAttemptRef.current = 0;
				dispatch({ type: WEBSOCKET_ACTION.SET_CONNECTION_STATUS, status: CONNECTION_STATUS.CONNECTED });
				dispatch({ type: WEBSOCKET_ACTION.CLEAR_ERROR });
			};

			websocket.onmessage = (event: MessageEvent) => {
				try {
					const serverMessage: ServerMessage = JSON.parse(event.data);

					if (
						serverMessage.type === SERVER_MESSAGE_TYPE.GAME_STATE ||
						serverMessage.type === SERVER_MESSAGE_TYPE.GAME_OVER
					) {
						dispatch({ type: WEBSOCKET_ACTION.SET_GAME, game: serverMessage });
					} else if (serverMessage.type === SERVER_MESSAGE_TYPE.ERROR) {
						dispatch({ type: WEBSOCKET_ACTION.SET_ACTION_PENDING, isPending: false });
						dispatch({ type: WEBSOCKET_ACTION.SET_ERROR, message: serverMessage.message });
					} else if (serverMessage.type === SERVER_MESSAGE_TYPE.ACTION_RESULT) {
						dispatch({
							type: WEBSOCKET_ACTION.SET_ACTION_RESULT,
							accepted: serverMessage.accepted,
							message: serverMessage.message,
						});
					}
				} catch {
					dispatch({ type: WEBSOCKET_ACTION.SET_ACTION_PENDING, isPending: false });
					dispatch({ type: WEBSOCKET_ACTION.SET_ERROR, message: "Failed to parse server message" });
				}
			};

			websocket.onerror = () => {
				dispatch({ type: WEBSOCKET_ACTION.SET_ERROR, message: "Connection error. Retrying..." });
			};

			websocket.onclose = () => {
				if (websocketRef.current === websocket) {
					websocketRef.current = null;
				}
				dispatch({ type: WEBSOCKET_ACTION.SET_ACTION_PENDING, isPending: false });
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
		if (websocket && websocket.readyState === WebSocket.OPEN && !state.isActionPending) {
			const message: ControlMessage = { type, ...(numPlayers && { num_players: numPlayers }) };
			dispatch({ type: WEBSOCKET_ACTION.SET_ACTION_PENDING, isPending: true });
			try {
				websocket.send(JSON.stringify(message));
			} catch {
				dispatch({ type: WEBSOCKET_ACTION.SET_ACTION_PENDING, isPending: false });
				dispatch({ type: WEBSOCKET_ACTION.SET_ERROR, message: "Unable to send command. Please try again." });
			}
		}
	};

	return {
		game: state.game,
		connectionStatus: state.connectionStatus,
		errorMessage: state.errorMessage,
		isActionPending: state.isActionPending,
		sendControlMessage,
	};
};
