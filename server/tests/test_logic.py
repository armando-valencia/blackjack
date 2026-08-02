import pytest

from game.cards import Card, Rank, Suit
from game.logic import BlackjackGame
from game.player import PlayerStatus
from utils import GameResult


def create_game_with_human_player() -> BlackjackGame:
    game = BlackjackGame()
    game.initialize_players(1)
    return game


@pytest.mark.parametrize(
    ("cards", "expected_result"),
    [
        ([Card(Rank.ACE, Suit.HEARTS), Card(Rank.KING, Suit.SPADES)], True),
        ([Card(Rank.ACE, Suit.HEARTS), Card(Rank.NINE, Suit.SPADES)], False),
        (
            [
                Card(Rank.TEN, Suit.HEARTS),
                Card(Rank.ACE, Suit.SPADES),
                Card(Rank.TWO, Suit.DIAMONDS),
            ],
            False,
        ),
    ],
)
def test__is_blackjack__identifies_initial_blackjack_only(cards, expected_result):
    game = BlackjackGame()

    assert game._is_blackjack(cards) is expected_result


def test__deal_initial_hand__deals_two_cards_and_starts_first_active_turn(monkeypatch):
    game = create_game_with_human_player()
    ordered_deck = [
        Card(Rank.NINE, Suit.DIAMONDS),
        Card(Rank.SEVEN, Suit.CLUBS),
        Card(Rank.TEN, Suit.SPADES),
        Card(Rank.SIX, Suit.HEARTS),
    ]
    monkeypatch.setattr("game.logic.create_deck", lambda: ordered_deck.copy())

    game.deal_initial_hand()

    assert [str(card) for card in game.players[0].hand] == ["6H", "10S"]
    assert [str(card) for card in game.dealer_hand] == ["7C", "9D"]
    assert game.game_status == "playing"
    assert game.current_player_index == 0
    assert game.players[0].status == PlayerStatus.PLAYING.value


def test__player_hit__marks_player_bust_and_resolves_round():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card(Rank.TEN, Suit.HEARTS))
    player.add_card(Card(Rank.EIGHT, Suit.SPADES))
    player.status = PlayerStatus.PLAYING.value
    game.dealer_score = 17
    game.game_status = "playing"
    game.current_player_index = 0
    game.deck = [Card(Rank.FIVE, Suit.DIAMONDS)]

    turn_ended = game.player_hit()

    assert turn_ended is True
    assert player.score == 23
    assert player.status == PlayerStatus.DONE.value
    assert player.result == GameResult.LOSE.value
    assert game.game_status == "game_over"


def test__player_hit__stands_at_twenty_one_and_resolves_round():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card(Rank.TEN, Suit.HEARTS))
    player.add_card(Card(Rank.SIX, Suit.SPADES))
    player.status = PlayerStatus.PLAYING.value
    game.dealer_hand = [Card(Rank.TEN, Suit.DIAMONDS), Card(Rank.SEVEN, Suit.CLUBS)]
    game.dealer_score = 17
    game.game_status = "playing"
    game.current_player_index = 0
    game.deck = [Card(Rank.FIVE, Suit.DIAMONDS)]

    turn_ended = game.player_hit()

    assert turn_ended is True
    assert player.score == 21
    assert player.status == PlayerStatus.DONE.value
    assert player.result == GameResult.WIN.value
    assert game.game_status == "game_over"


def test__player_stand__ends_turn_and_dealer_resolves_hand():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card(Rank.TEN, Suit.HEARTS))
    player.add_card(Card(Rank.EIGHT, Suit.SPADES))
    player.status = PlayerStatus.PLAYING.value
    game.dealer_hand = [Card(Rank.TEN, Suit.DIAMONDS), Card(Rank.SEVEN, Suit.CLUBS)]
    game.dealer_score = 17
    game.game_status = "playing"
    game.current_player_index = 0

    game.player_stand()

    assert player.status == PlayerStatus.DONE.value
    assert player.result == GameResult.WIN.value
    assert game.dealer_score == 17
    assert game.game_status == "game_over"


@pytest.mark.parametrize(
    ("player_score", "dealer_score", "expected_result"),
    [
        (20, 19, GameResult.WIN.value),
        (18, 19, GameResult.LOSE.value),
        (19, 19, GameResult.PUSH.value),
    ],
)
def test__dealer_turn__resolves_player_against_dealer(
    player_score, dealer_score, expected_result
):
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card(Rank(str(player_score - 10)), Suit.HEARTS))
    player.add_card(Card(Rank.TEN, Suit.SPADES))
    game.dealer_hand = [
        Card(Rank(str(dealer_score - 10)), Suit.DIAMONDS),
        Card(Rank.TEN, Suit.CLUBS),
    ]
    game.dealer_score = dealer_score
    game.game_status = "dealer_turn"

    game.dealer_turn()

    assert player.result == expected_result
    assert player.status == PlayerStatus.DONE.value
    assert game.game_status == "game_over"


def test__dealer_turn__awards_wins_when_dealer_busts():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card(Rank.TEN, Suit.HEARTS))
    player.add_card(Card(Rank.EIGHT, Suit.SPADES))
    game.dealer_hand = [
        Card(Rank.TEN, Suit.DIAMONDS),
        Card(Rank.EIGHT, Suit.CLUBS),
        Card(Rank.FIVE, Suit.HEARTS),
    ]
    game.dealer_score = 23
    game.game_status = "dealer_turn"

    game.dealer_turn()

    assert player.result == GameResult.WIN.value
    assert player.status == PlayerStatus.DONE.value


def test__handle_deck_exhaustion__ends_round_as_push():
    game = create_game_with_human_player()
    player = game.players[0]
    player.status = PlayerStatus.PLAYING.value

    game.handle_deck_exhaustion()

    assert game.game_status == "game_over"
    assert player.status == PlayerStatus.DONE.value
    assert player.result == GameResult.PUSH.value
