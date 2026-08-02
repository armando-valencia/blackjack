import random

from utils import PlayerAction

BOT_NAMES = [
    "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank",
    "Ivy", "Jack", "Kathy", "Leo", "Mona", "Nina", "Oscar", "Pam", "Quinn",
    "Rita", "Sam", "Tina", "Uma", "Vince", "Wendy", "Xander", "Yara", "Zane"
]


def get_random_bot_name(used_names: set[str]) -> str:
    """
    Get a random bot name that hasn't been used yet.
    If all names are used, append a number.
    """
    available_names = [name for name in BOT_NAMES if name not in used_names]

    if available_names:
        return random.choice(available_names)
    else:
        # If all names used, pick any and append a number
        return f"{random.choice(BOT_NAMES)} {random.randint(1, 99)}"


def make_bot_decision(hand_score: int, dealer_upcard_value: int) -> str:
    """
    Simple bot strategy for hitting or standing.

    Basic strategy:
    - Hit if score < 17
    - Stand if score >= 17

    Args:
        hand_score: Current score of the bot's hand
        dealer_upcard_value: Value of dealer's visible card (not used in simple strategy)

    Returns:
        "hit" or "stand"
    """
    if hand_score < 17:
        return PlayerAction.HIT.value
    else:
        return PlayerAction.STAND.value
