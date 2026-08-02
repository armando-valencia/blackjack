import {
	BUTTON_VARIANT,
	CONNECTION_STATUS,
	CONTROL_MESSAGE_TYPE,
	GAME_RESULT,
	GAME_STATUS,
	PLAYER_STATUS,
	SERVER_MESSAGE_TYPE,
} from "../constants";

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
export type PlayerStatus = (typeof PLAYER_STATUS)[keyof typeof PLAYER_STATUS];
export type GameResult = (typeof GAME_RESULT)[keyof typeof GAME_RESULT];
export type ServerMessageType = (typeof SERVER_MESSAGE_TYPE)[keyof typeof SERVER_MESSAGE_TYPE];
export type GameStateMessageType =
	| typeof SERVER_MESSAGE_TYPE.GAME_STATE
	| typeof SERVER_MESSAGE_TYPE.GAME_OVER;
export type ControlMessageType = (typeof CONTROL_MESSAGE_TYPE)[keyof typeof CONTROL_MESSAGE_TYPE];
export type ConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];
export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

export interface PlayerState {
	player_id: number;
	name: string;
	hand: string[];
	score: number;
	status: PlayerStatus;
	result: GameResult | null;
	is_human: boolean;
}

// Multiplayer game state
export interface MultiplayerGameState {
	type: GameStateMessageType;
	players: PlayerState[];
	dealer_hand: string[];
	dealer_score: number;
	current_player_index: number;
	game_status: GameStatus;
	message: string;
}

// Error message from server
export interface ErrorMessage {
	type: typeof SERVER_MESSAGE_TYPE.ERROR;
	message: string;
}

// All possible server messages
export type ServerMessage = MultiplayerGameState | ErrorMessage;

// Control messages sent to server
export interface ControlMessage {
	type: ControlMessageType;
	num_players?: number;
}

// Card representation
export interface Card {
	rank: string;
	suit: string;
}
