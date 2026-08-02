import pytest

from command_validation import CommandValidationError, validate_command
from game.logic import BlackjackGame
from utils import ControlMessageType, GameStatus


def create_configured_game() -> BlackjackGame:
    game = BlackjackGame()
    game.initialize_players(1)
    return game


def test__validate_command__accepts_player_configuration_before_game_setup():
    game = BlackjackGame()

    command, player_count = validate_command(
        game,
        {"type": ControlMessageType.SET_PLAYER_COUNT.value, "num_players": 2},
    )

    assert command == ControlMessageType.SET_PLAYER_COUNT.value
    assert player_count == 2


@pytest.mark.parametrize("requested_count", [0, 5, "2", True, None])
def test__validate_command__rejects_invalid_player_count(requested_count):
    game = BlackjackGame()

    with pytest.raises(CommandValidationError, match="Player count"):
        validate_command(
            game,
            {
                "type": ControlMessageType.SET_PLAYER_COUNT.value,
                "num_players": requested_count,
            },
        )


def test__validate_command__rejects_unknown_command():
    game = BlackjackGame()

    with pytest.raises(CommandValidationError, match="Unknown command"):
        validate_command(game, {"type": "restart"})


def test__validate_command__rejects_non_object_payload():
    game = BlackjackGame()

    with pytest.raises(CommandValidationError, match="JSON object"):
        validate_command(game, [ControlMessageType.HIT.value])


def test__validate_command__rejects_configuration_after_setup():
    game = create_configured_game()

    with pytest.raises(CommandValidationError, match="before the game is configured"):
        validate_command(
            game,
            {"type": ControlMessageType.SET_PLAYER_COUNT.value, "num_players": 2},
        )


def test__validate_command__accepts_deal_after_setup():
    game = create_configured_game()

    command, player_count = validate_command(
        game,
        {"type": ControlMessageType.DEAL_INITIAL.value},
    )

    assert command == ControlMessageType.DEAL_INITIAL.value
    assert player_count is None


def test__validate_command__rejects_deal_without_setup():
    game = BlackjackGame()

    with pytest.raises(CommandValidationError, match="Configure the players"):
        validate_command(game, {"type": ControlMessageType.DEAL_INITIAL.value})


def test__validate_command__rejects_action_outside_playing_phase():
    game = create_configured_game()

    with pytest.raises(CommandValidationError, match="not accepting player actions"):
        validate_command(game, {"type": ControlMessageType.HIT.value})


def test__validate_command__rejects_action_during_bot_turn():
    game = create_configured_game()
    game.game_status = GameStatus.PLAYING.value
    game.players[0].is_human = False

    with pytest.raises(CommandValidationError, match="not your turn"):
        validate_command(game, {"type": ControlMessageType.STAND.value})
