from game.cards import Card
    

def calculate_hand_value(hand: list[Card]) -> int:
    score = sum(
        card.get_value()
        for card
        in hand
    )
    # Adjust for Aces if busted
    num_aces = sum(1 for card in hand if card.rank == 'A')
    while score > 21 and num_aces > 0:
        score -= 10
        num_aces -= 1
    return score