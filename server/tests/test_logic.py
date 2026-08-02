import pytest

from game.cards import Card
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
        ([Card("A", "H"), Card("K", "S")], True),
        ([Card("A", "H"), Card("9", "S")], False),
        ([Card("10", "H"), Card("A", "S"), Card("2", "D")], False),
    ],
)
def test__is_blackjack__identifies_initial_blackjack_only(cards, expected_result):
    game = BlackjackGame()

    assert game._is_blackjack(cards) is expected_result


def test__deal_initial_hand__deals_two_cards_and_starts_first_active_turn(monkeypatch):
    game = create_game_with_human_player()
    ordered_deck = [
        Card("9", "D"),
        Card("7", "C"),
        Card("10", "S"),
        Card("6", "H"),
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
    player.add_card(Card("10", "H"))
    player.add_card(Card("8", "S"))
    player.status = PlayerStatus.PLAYING.value
    game.dealer_score = 17
    game.game_status = "playing"
    game.current_player_index = 0
    game.deck = [Card("5", "D")]

    turn_ended = game.player_hit()

    assert turn_ended is True
    assert player.score == 23
    assert player.status == PlayerStatus.DONE.value
    assert player.result == GameResult.LOSE.value
    assert game.game_status == "game_over"


def test__player_hit__stands_at_twenty_one_and_resolves_round():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card("10", "H"))
    player.add_card(Card("6", "S"))
    player.status = PlayerStatus.PLAYING.value
    game.dealer_hand = [Card("10", "D"), Card("7", "C")]
    game.dealer_score = 17
    game.game_status = "playing"
    game.current_player_index = 0
    game.deck = [Card("5", "D")]

    turn_ended = game.player_hit()

    assert turn_ended is True
    assert player.score == 21
    assert player.status == PlayerStatus.DONE.value
    assert player.result == GameResult.WIN.value
    assert game.game_status == "game_over"


def test__player_stand__ends_turn_and_dealer_resolves_hand():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card("10", "H"))
    player.add_card(Card("8", "S"))
    player.status = PlayerStatus.PLAYING.value
    game.dealer_hand = [Card("10", "D"), Card("7", "C")]
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
    player.add_card(Card(str(player_score - 10), "H"))
    player.add_card(Card("10", "S"))
    game.dealer_hand = [Card(str(dealer_score - 10), "D"), Card("10", "C")]
    game.dealer_score = dealer_score
    game.game_status = "dealer_turn"

    game.dealer_turn()

    assert player.result == expected_result
    assert player.status == PlayerStatus.DONE.value
    assert game.game_status == "game_over"


def test__dealer_turn__awards_wins_when_dealer_busts():
    game = create_game_with_human_player()
    player = game.players[0]
    player.add_card(Card("10", "H"))
    player.add_card(Card("8", "S"))
    game.dealer_hand = [Card("10", "D"), Card("8", "C"), Card("5", "H")]
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
