import enum


class GameStatus(enum.Enum):
    DEALER_TURN = "dealer_turn"
    GAME_OVER = "game_over"
    PLAYER_TURN = "player_turn"
    WAITING = "waiting"

class GameResult(enum.Enum):
    WIN = "win"
    LOSE = "lose"
    PUSH = "push"

class GameMessage(enum.Enum):
    BLACKJACK = "Blackjack! You win!"
    BOTH_BLACKJACK = "Push! Both have Blackjack."
    DEALER_BLACKJACK = "Dealer Blackjack! You lose."
    DEALER_BUST = "Dealer busts! You win!"
    DEALER_TURN = "Dealer is playing..."
    DEALING = "Dealing hand..."
    PLAYER_BUST = "Bust! You lose."
    PLAYER_HIT = "You hit."
    PLAYER_LOSES = "You lose."
    PLAYER_PUSH = "Push!"
    PLAYER_STAND = "You stand. Dealer's turn."
    PLAYER_TURN = "Hit or Stand?"
    PLAYER_WINS = "You win!"
