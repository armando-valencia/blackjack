interface BaseGameState {
	player_hand: string[];
	dealer_hand: string[];
	player_score: number;
	dealer_score: number;
	game_status: "waiting" | "player_turn" | "dealer_turn" | "game_over";
	message: string;
	result: "win" | "lose" | "push" | null;
}

export interface GameState extends BaseGameState {
	type: "game_state";
}

export interface GameOverState extends BaseGameState {
	type: "game_over";
}

// Define the ErrorMessage interface
export interface ErrorMessage {
	type: "error";
	message: string;
}

export type ServerMessage = GameState | GameOverState | ErrorMessage;

export interface ControlMessage {
	type: "deal_initial" | "hit" | "stand";
}

export interface Card {
	rank: string;
	suit: string;
}
