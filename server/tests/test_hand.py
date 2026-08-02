import pytest

from game.cards import Card, Rank, Suit
from game.hand import calculate_hand_value


@pytest.mark.parametrize(
    ("cards", "expected_score"),
    [
        ([Card(Rank.TEN, Suit.HEARTS), Card(Rank.SEVEN, Suit.SPADES)], 17),
        ([Card(Rank.KING, Suit.HEARTS), Card(Rank.QUEEN, Suit.SPADES)], 20),
        ([Card(Rank.ACE, Suit.HEARTS), Card(Rank.SIX, Suit.SPADES)], 17),
        (
            [
                Card(Rank.ACE, Suit.HEARTS),
                Card(Rank.SIX, Suit.SPADES),
                Card(Rank.TEN, Suit.DIAMONDS),
            ],
            17,
        ),
    ],
)
def test__calculate_hand_value__returns_correct_score(cards, expected_score):
    assert calculate_hand_value(cards) == expected_score


def test__calculate_hand_value__reduces_multiple_aces_when_needed():
    cards = [
        Card(Rank.ACE, Suit.HEARTS),
        Card(Rank.ACE, Suit.SPADES),
        Card(Rank.NINE, Suit.DIAMONDS),
        Card(Rank.FIVE, Suit.CLUBS),
    ]

    assert calculate_hand_value(cards) == 16
