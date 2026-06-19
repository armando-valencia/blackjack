from game.hand import calculate_hand_value
from game.logic import BlackjackGame
from utils import GameStatus, HIDDEN_CARD, ServerMessageType


def serialize_game_state(game: BlackjackGame) -> dict:
    reveal_dealer_hand = game.game_status in {
        GameStatus.GAME_OVER.value,
        GameStatus.DEALER_TURN.value,
    }

    dealer_hand = []
    if game.dealer_hand:
        dealer_hand.append(str(game.dealer_hand[0]))
        if reveal_dealer_hand:
            dealer_hand.extend(str(card) for card in game.dealer_hand[1:])
        else:
            dealer_hand.append(HIDDEN_CARD)

    dealer_score = (
        game.dealer_score
        if reveal_dealer_hand
        else calculate_hand_value([game.dealer_hand[0]]) if game.dealer_hand else 0
    )

    return {
        "type": (
            ServerMessageType.GAME_STATE.value
            if game.game_status != GameStatus.GAME_OVER.value
            else ServerMessageType.GAME_OVER.value
        ),
        "players": [player.to_dict() for player in game.players],
        "dealer_hand": dealer_hand,
        "dealer_score": dealer_score,
        "current_player_index": game.current_player_index,
        "game_status": game.game_status,
        "message": game.message,
    }
