from game.cards import Card, Rank, Suit
from game.service import GameService
from utils import ControlMessageType, GameStatus, ServerMessageType


def test__execute_command__configures_players_and_returns_state():
    service = GameService()

    result = service.execute_command(
        {"type": ControlMessageType.SET_PLAYER_COUNT.value, "num_players": 1}
    )

    assert result.action == ControlMessageType.SET_PLAYER_COUNT.value
    assert result.message == "Player count updated."
    assert result.state["type"] == ServerMessageType.GAME_STATE.value
    assert len(result.state["players"]) == 1


def test__execute_command__deals_hand_without_websocket_dependencies(monkeypatch):
    service = GameService()
    service.execute_command(
        {"type": ControlMessageType.SET_PLAYER_COUNT.value, "num_players": 1}
    )
    ordered_deck = [
        Card(Rank.NINE, Suit.DIAMONDS),
        Card(Rank.SEVEN, Suit.CLUBS),
        Card(Rank.TEN, Suit.SPADES),
        Card(Rank.SIX, Suit.HEARTS),
    ]
    monkeypatch.setattr("game.logic.create_deck", lambda: ordered_deck.copy())

    result = service.execute_command({"type": ControlMessageType.DEAL_INITIAL.value})

    assert result.action == ControlMessageType.DEAL_INITIAL.value
    assert result.state["game_status"] == GameStatus.PLAYING.value
    assert result.state["dealer_hand"] == ["7C", "Hidden"]
    assert result.state["dealer_score"] == 7


def test__get_state__reveals_dealer_hand_after_game_over():
    service = GameService()
    service.game.dealer_hand = [Card(Rank.TEN, Suit.HEARTS), Card(Rank.SEVEN, Suit.SPADES)]
    service.game.dealer_score = 17
    service.game.game_status = GameStatus.GAME_OVER.value

    state = service.get_state()

    assert state["type"] == ServerMessageType.GAME_OVER.value
    assert state["dealer_hand"] == ["10H", "7S"]
    assert state["dealer_score"] == 17
