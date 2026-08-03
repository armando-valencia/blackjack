from dataclasses import dataclass

from command_validation import validate_command
from game.logic import BlackjackGame
from game.state_serializer import serialize_game_state
from utils import ControlMessageType, GameStatus


@dataclass(frozen=True)
class CommandResult:
    action: str
    message: str
    state: dict


class GameService:
    def __init__(self):
        self.game = BlackjackGame()

    def get_state(self) -> dict:
        return serialize_game_state(self.game)

    def execute_command(self, request: object) -> CommandResult:
        action, player_count = validate_command(self.game, request)

        if action == ControlMessageType.SET_PLAYER_COUNT.value:
            self.game.initialize_players(player_count)
            message = "Player count updated."
        elif action == ControlMessageType.DEAL_INITIAL.value:
            self.game.deal_initial_hand()
            message = "Hand dealt."
        elif action == ControlMessageType.RESTART_HAND.value:
            self.game.deal_initial_hand()
            message = "New hand started."
        elif action == ControlMessageType.RETURN_TO_MENU.value:
            self.game.reset_to_menu()
            message = "Returned to menu."
        elif action == ControlMessageType.HIT.value:
            self.game.player_hit()
            message = "Hit accepted."
        else:
            self.game.player_stand()
            message = "Stand accepted."

        return CommandResult(action, message, self.get_state())

    def process_bot_turn(self) -> CommandResult | None:
        bot_action = self.game.process_bot_turn()
        if bot_action["action"] is None:
            return None

        return CommandResult(
            bot_action["action"],
            "Bot turn processed.",
            self.get_state(),
        )

    def has_active_bot_turn(self) -> bool:
        if self.game.game_status != GameStatus.PLAYING.value:
            return False

        if not self.game.players or not 0 <= self.game.current_player_index < len(self.game.players):
            return False

        current_player = self.game.players[self.game.current_player_index]
        return not current_player.is_human
