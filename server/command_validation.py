from collections.abc import Mapping

from game.logic import BlackjackGame
from game.player import PlayerStatus
from utils import ControlMessageType, GameStatus

MIN_PLAYER_COUNT = 1
MAX_PLAYER_COUNT = 4


class CommandValidationError(ValueError):
    def __init__(self, message: str, action: str | None = None):
        super().__init__(message)
        self.action = action


def validate_command(game: BlackjackGame, request: object) -> tuple[str, int | None]:
    if not isinstance(request, Mapping):
        raise CommandValidationError("Command must be a JSON object.")

    message_type = request.get("type")
    valid_commands = {command.value for command in ControlMessageType}
    if message_type not in valid_commands:
        raise CommandValidationError("Unknown command.")

    if message_type == ControlMessageType.SET_PLAYER_COUNT.value:
        return message_type, validate_player_count(game, request.get("num_players"))

    if message_type == ControlMessageType.DEAL_INITIAL.value:
        validate_deal_command(game, message_type)
        return message_type, None

    if message_type == ControlMessageType.RESTART_HAND.value:
        validate_restart_command(game, message_type)
        return message_type, None

    if message_type == ControlMessageType.RETURN_TO_MENU.value:
        return message_type, None

    validate_player_action(game, message_type)
    return message_type, None


def validate_player_count(game: BlackjackGame, requested_count: object) -> int:
    if game.game_status != GameStatus.WAITING.value or game.players:
        raise CommandValidationError(
            "Player count can only be set before the game is configured.",
            ControlMessageType.SET_PLAYER_COUNT.value,
        )

    if isinstance(requested_count, bool) or not isinstance(requested_count, int):
        raise CommandValidationError(
            "Player count must be an integer from 1 to 4.",
            ControlMessageType.SET_PLAYER_COUNT.value,
        )

    if not MIN_PLAYER_COUNT <= requested_count <= MAX_PLAYER_COUNT:
        raise CommandValidationError(
            "Player count must be an integer from 1 to 4.",
            ControlMessageType.SET_PLAYER_COUNT.value,
        )

    return requested_count


def validate_deal_command(game: BlackjackGame, action: str) -> None:
    if not game.players:
        raise CommandValidationError(
            "Configure the players before dealing.",
            action,
        )


def validate_restart_command(game: BlackjackGame, action: str) -> None:
    if not game.players:
        raise CommandValidationError(
            "Configure the players before restarting the hand.",
            action,
        )

    allowed_statuses = {GameStatus.WAITING.value, GameStatus.GAME_OVER.value}
    if game.game_status not in allowed_statuses:
        raise CommandValidationError(
            "A new hand cannot be dealt while the game is active.",
            action,
        )


def validate_player_action(game: BlackjackGame, action: str) -> None:
    if game.game_status != GameStatus.PLAYING.value:
        raise CommandValidationError(
            "The game is not accepting player actions.",
            action,
        )

    if not game.players or not 0 <= game.current_player_index < len(game.players):
        raise CommandValidationError("There is no active player.", action)

    current_player = game.players[game.current_player_index]
    if not current_player.is_human:
        raise CommandValidationError("It is not your turn.", action)

    if current_player.status != PlayerStatus.PLAYING.value:
        raise CommandValidationError("Your hand is not accepting actions.", action)
