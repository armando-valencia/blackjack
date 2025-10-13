from enum import Enum
from game.cards import Card
from game.hand import calculate_hand_value


class PlayerStatus(Enum):
    """Enum for player status during the game"""
    WAITING = "waiting"
    PLAYING = "playing"
    STANDING = "standing"
    BUST = "bust"
    DONE = "done"


class PlayerState:
    """Represents a single player in the blackjack game"""

    def __init__(self, player_id: int, name: str, is_human: bool = False):
        self.player_id = player_id
        self.name = name
        self.is_human = is_human
        self.hand: list[Card] = []
        self.score: int = 0
        self.status: str = PlayerStatus.WAITING.value
        self.result: str | None = None

    def add_card(self, card: Card):
        """Add a card to the player's hand and update score"""
        self.hand.append(card)
        self.score = calculate_hand_value(self.hand)

    def reset_hand(self):
        """Reset player's hand for a new round"""
        self.hand = []
        self.score = 0
        self.status = PlayerStatus.WAITING.value
        self.result = None

    def to_dict(self) -> dict:
        """Convert player state to dictionary for frontend"""
        return {
            "player_id": self.player_id,
            "name": self.name,
            "hand": [str(card) for card in self.hand],
            "score": self.score,
            "status": self.status,
            "result": self.result,
            "is_human": self.is_human
        }
