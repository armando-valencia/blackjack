import random

class Card:
    def __init__(self, rank: str, suit: str):
        self.rank = rank
        self.suit = suit

    def __str__(self):
        return f"{self.rank}{self.suit}" # e.g., "AS", "KH", "2C"

    def get_value(self) -> int:
        """Get the integer value of the card."""
        if self.rank in ('J', 'Q', 'K'):
            return 10
        elif self.rank == 'A':
            return 11 # Aces start as 11, handle later if busts
        else:
            # Converts the string based rank to an integer
            return int(self.rank)


def create_deck() -> list[Card]:
    """
    Creates a deck of 52 cards, consisting of 4 suits and 13 ranks.
    """
    ranks = [str(n) for n in range(2, 11)] + ['J', 'Q', 'K', 'A']
    suits = ['H', 'D', 'C', 'S'] # Hearts, Diamonds, Clubs, Spades
    deck = [Card(rank, suit) for rank in ranks for suit in suits]

    # Shuffle the deck
    random.shuffle(deck)
    return deck