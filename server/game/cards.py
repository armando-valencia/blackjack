import random
from enum import Enum


class Rank(str, Enum):
    TWO = "2"
    THREE = "3"
    FOUR = "4"
    FIVE = "5"
    SIX = "6"
    SEVEN = "7"
    EIGHT = "8"
    NINE = "9"
    TEN = "10"
    JACK = "J"
    QUEEN = "Q"
    KING = "K"
    ACE = "A"


class Suit(str, Enum):
    HEARTS = "H"
    DIAMONDS = "D"
    CLUBS = "C"
    SPADES = "S"

class Card:
    def __init__(self, rank: Rank, suit: Suit):
        self.rank = rank
        self.suit = suit

    def __str__(self):
        return f"{self.rank.value}{self.suit.value}"

    def get_value(self) -> int:
        if self.rank in (Rank.JACK, Rank.QUEEN, Rank.KING):
            return 10
        if self.rank == Rank.ACE:
            return 11
        return int(self.rank.value)


def create_deck() -> list[Card]:
    """
    Creates a deck of 52 cards, consisting of 4 suits and 13 ranks.
    """
    ranks = list(Rank)
    suits = list(Suit)
    deck = [Card(rank, suit) for rank in ranks for suit in suits]

    # Shuffle the deck
    random.shuffle(deck)
    return deck
