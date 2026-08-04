import { describe, expect, it } from "vitest";
import {
	CARD_SUITS,
	CONNECTION_STATUS,
	GAME_STATUS,
	HIDDEN_CARD,
	PLAYER_STATUS,
	SERVER_MESSAGE_TYPE,
} from "../constants";
import type { MultiplayerGameState } from "../interfaces/game_interfaces";
import {
	initialWebSocketState,
	WEBSOCKET_ACTION,
	webSocketReducer,
} from "./useWebSocket";

const ACE_OF_HEARTS = `A${CARD_SUITS.HEARTS}`;
const TEN_OF_SPADES = `10${CARD_SUITS.SPADES}`;

const GAME_STATE: MultiplayerGameState = {
	type: SERVER_MESSAGE_TYPE.GAME_STATE,
	players: [
		{
			player_id: 0,
			name: "You",
			hand: [ACE_OF_HEARTS],
			score: 11,
			status: PLAYER_STATUS.PLAYING,
			result: null,
			is_human: true,
		},
	],
	dealer_hand: [TEN_OF_SPADES, HIDDEN_CARD],
	dealer_score: 10,
	current_player_index: 0,
	game_status: GAME_STATUS.PLAYING,
	message: "Your turn",
};

describe("webSocketReducer", () => {
	it("stores received game state without losing connection status", () => {
		const state = webSocketReducer(
			{ ...initialWebSocketState, connectionStatus: CONNECTION_STATUS.CONNECTED },
			{ type: WEBSOCKET_ACTION.SET_GAME, game: GAME_STATE },
		);

		expect(state.game).toBe(GAME_STATE);
		expect(state.connectionStatus).toBe(CONNECTION_STATUS.CONNECTED);
	});

	it("resolves pending actions and preserves rejected messages", () => {
		const pendingState = webSocketReducer(initialWebSocketState, {
			type: WEBSOCKET_ACTION.SET_ACTION_PENDING,
			isPending: true,
		});
		const rejectedState = webSocketReducer(pendingState, {
			type: WEBSOCKET_ACTION.SET_ACTION_RESULT,
			accepted: false,
			message: "The game is not accepting actions.",
		});

		expect(rejectedState.isActionPending).toBe(false);
		expect(rejectedState.errorMessage).toBe("The game is not accepting actions.");
	});
});
