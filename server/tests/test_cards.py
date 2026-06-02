import pytest

from game.cards import Card, Rank, Suit, create_deck


@pytest.mark.parametrize(
    ("rank", "expected_value"),
    [
        (Rank.TWO, 2),
        (Rank.TEN, 10),
        (Rank.JACK, 10),
        (Rank.QUEEN, 10),
        (Rank.KING, 10),
        (Rank.ACE, 11),
    ],
)
def test__get_value__returns_rank_value(rank, expected_value):
    card = Card(rank, Suit.HEARTS)

    assert card.get_value() == expected_value


def test__str__serializes_rank_and_suit_values():
    card = Card(Rank.ACE, Suit.SPADES)

    assert str(card) == "AS"


def test__create_deck__contains_one_card_for_each_rank_and_suit():
    deck = create_deck()

    assert len(deck) == 52
    assert {(card.rank, card.suit) for card in deck} == {
        (rank, suit) for rank in Rank for suit in Suit
    }
