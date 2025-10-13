// Player state in multiplayer game
export interface PlayerState {
	player_id: number;
	name: string;
	hand: string[];
	score: number;
	status: "waiting" | "playing" | "standing" | "bust" | "done";
	result: "win" | "lose" | "push" | null;
	is_human: boolean;
}

// Multiplayer game state
export interface MultiplayerGameState {
	type: "game_state" | "game_over";
	players: PlayerState[];
	dealer_hand: string[];
	dealer_score: number;
	current_player_index: number;
	game_status: "waiting" | "playing" | "dealer_turn" | "game_over";
	message: string;
}

// Error message from server
export interface ErrorMessage {
	type: "error";
	message: string;
}

// All possible server messages
export type ServerMessage = MultiplayerGameState | ErrorMessage;

// Control messages sent to server
export interface ControlMessage {
	type: "set_player_count" | "deal_initial" | "hit" | "stand";
	num_players?: number;
}

// Card representation
export interface Card {
	rank: string;
	suit: string;
}
