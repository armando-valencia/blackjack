import pytest

from game.cards import Card
from game.hand import calculate_hand_value


@pytest.mark.parametrize(
    ("cards", "expected_score"),
    [
        ([Card("10", "H"), Card("7", "S")], 17),
        ([Card("K", "H"), Card("Q", "S")], 20),
        ([Card("A", "H"), Card("6", "S")], 17),
        ([Card("A", "H"), Card("6", "S"), Card("10", "D")], 17),
    ],
)
def test__calculate_hand_value__returns_correct_score(cards, expected_score):
    assert calculate_hand_value(cards) == expected_score


def test__calculate_hand_value__reduces_multiple_aces_when_needed():
    cards = [Card("A", "H"), Card("A", "S"), Card("9", "D"), Card("5", "C")]

    assert calculate_hand_value(cards) == 16
