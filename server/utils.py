import enum


class GameStatus(enum.Enum):
    DEALER_TURN = "dealer_turn"
    GAME_OVER = "game_over"
    PLAYING = "playing"
    WAITING = "waiting"

class GameResult(enum.Enum):
    WIN = "win"
    LOSE = "lose"
    PUSH = "push"


class PlayerAction(enum.Enum):
    HIT = "hit"
    STAND = "stand"


class ControlMessageType(enum.Enum):
    SET_PLAYER_COUNT = "set_player_count"
    DEAL_INITIAL = "deal_initial"
    RESTART_HAND = "restart_hand"
    RETURN_TO_MENU = "return_to_menu"
    HIT = PlayerAction.HIT.value
    STAND = PlayerAction.STAND.value


class ServerMessageType(enum.Enum):
    GAME_STATE = "game_state"
    GAME_OVER = "game_over"
    ACTION_RESULT = "action_result"
    ERROR = "error"

class GameMessage(enum.Enum):
    BLACKJACK = "Blackjack! You win!"
    BOTH_BLACKJACK = "Push! Both have Blackjack."
    DEALER_BLACKJACK = "Dealer Blackjack! You lose."
    DEALER_BUST = "Dealer busts! You win!"
    DEALER_TURN = "Dealer is playing..."
    DEALING = "Dealing hand..."
    DECK_EXHAUSTED = "Deck exhausted. Game ends in a push."
    PLAYER_BUST = "Bust! You lose."
    PLAYER_HIT = "You hit."
    PLAYER_LOSES = "You lose."
    PLAYER_PUSH = "Push!"
    PLAYER_STAND = "You stand. Dealer's turn."
    PLAYER_TURN = "Hit or Stand?"
    PLAYER_WINS = "You win!"

# Constants
HIDDEN_CARD = "Hidden"
