export const HIDDEN_CARD = "Hidden";

export const GAME_STATUS = {
	WAITING: "waiting",
	PLAYING: "playing",
	DEALER_TURN: "dealer_turn",
	GAME_OVER: "game_over",
} as const;

export const PLAYER_STATUS = {
	WAITING: "waiting",
	PLAYING: "playing",
	STANDING: "standing",
	BUST: "bust",
	DONE: "done",
} as const;

export const GAME_RESULT = {
	WIN: "win",
	LOSE: "lose",
	PUSH: "push",
} as const;

export const SERVER_MESSAGE_TYPE = {
	GAME_STATE: "game_state",
	GAME_OVER: "game_over",
	ACTION_RESULT: "action_result",
	ERROR: "error",
} as const;

export const CONTROL_MESSAGE_TYPE = {
	SET_PLAYER_COUNT: "set_player_count",
	DEAL_INITIAL: "deal_initial",
	HIT: "hit",
	STAND: "stand",
} as const;

export const CONNECTION_STATUS = {
	CONNECTING: "connecting",
	RECONNECTING: "reconnecting",
	CONNECTED: "connected",
	DISCONNECTED: "disconnected",
	ERROR: "error",
} as const;

export const CARD_SUITS = {
	HEARTS: "H",
	DIAMONDS: "D",
	CLUBS: "C",
	SPADES: "S",
} as const;

export const BUTTON_VARIANT = {
	DEAL: "deal",
	HIT: "hit",
	STAND: "stand",
} as const;
