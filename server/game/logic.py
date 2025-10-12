from game.cards import Card, create_deck
from game.hand import calculate_hand_value
from utils import GameStatus, GameResult, GameMessage, HIDDEN_CARD

class BlackjackGame:
    def __init__(self):
        self.deck: list[Card] = create_deck()
        self.player_hand: list[Card] = []
        self.dealer_hand: list[Card] = []
        self.player_score: int = 0
        self.dealer_score: int = 0
        self.game_status: str = GameStatus.WAITING.value
        self.result: str | None = None
        self.message: str = "" # Message to send to the frontend

    def _is_blackjack(self, hand: list[Card]) -> bool:
        """
        Check if a hand is a true Blackjack (Ace + 10-value card on initial deal).
        Only valid for 2-card hands.
        """
        if len(hand) != 2:
            return False

        has_ace = any(card.rank == 'A' for card in hand)
        has_ten_value = any(card.rank in ('10', 'J', 'Q', 'K') for card in hand)

        return has_ace and has_ten_value

    def deal_initial_hand(self):
        self.deck = create_deck() # Reset deck for a new hand
        self.player_hand = []
        self.dealer_hand = []
        self.result = None
        self.message = GameMessage.DEALING.value

        # Deal two cards to player
        self.player_hand.append(self.deck.pop())
        self.player_hand.append(self.deck.pop())

        # Deal two cards to dealer (one face up, one face down)
        self.dealer_hand.append(self.deck.pop())
        self.dealer_hand.append(self.deck.pop()) # This will be the hidden card

        self.player_score = calculate_hand_value(self.player_hand)
        self.dealer_score = calculate_hand_value(self.dealer_hand) # Full score for logic, but frontend only sees partial

        # Check for initial Blackjack (Ace + 10-value card)
        player_has_blackjack = self._is_blackjack(self.player_hand)
        dealer_has_blackjack = self._is_blackjack(self.dealer_hand)

        if player_has_blackjack and dealer_has_blackjack:
            self.game_status = GameStatus.GAME_OVER.value
            self.result = GameResult.PUSH.value
            self.message = GameMessage.BOTH_BLACKJACK.value
        elif player_has_blackjack:
            self.game_status = GameStatus.GAME_OVER.value
            self.result = GameResult.WIN.value
            self.message = GameMessage.BLACKJACK.value
        elif dealer_has_blackjack:
             self.game_status = GameStatus.GAME_OVER.value
             self.result = GameResult.LOSE.value
             self.message = GameMessage.DEALER_BLACKJACK.value
        else:
             self.game_status = GameStatus.PLAYER_TURN.value
             self.message = GameMessage.PLAYER_TURN.value


    def player_hit(self) -> bool: # Returns True if game is over (bust)
        if self.game_status != GameStatus.PLAYER_TURN.value:
            return False # Cannot hit

        # Check if deck is exhausted
        if not self.deck:
            self.handle_deck_exhaustion()
            return True

        self.player_hand.append(self.deck.pop())
        self.player_score = calculate_hand_value(self.player_hand)
        self.message = GameMessage.PLAYER_HIT.value

        if self.player_score > 21:
            self.game_status = GameStatus.GAME_OVER.value
            self.result = GameResult.LOSE.value
            self.message = GameMessage.PLAYER_BUST.value
            return True
        elif self.player_score == 21:
            # stand when player reaches 21
            self.player_stand()
            return True
        return False

    def player_stand(self):
        if self.game_status != GameStatus.PLAYER_TURN.value:
            return

        self.game_status = GameStatus.DEALER_TURN.value
        self.message = GameMessage.PLAYER_STAND.value
        self.dealer_turn()


    def dealer_turn(self):
        if self.game_status != GameStatus.DEALER_TURN.value:
            return

        self.message = GameMessage.DEALER_TURN.value
        # Dealer hits until score is 17 or more
        while self.dealer_score < 17:
            # Check if deck is exhausted
            if not self.deck:
                self.handle_deck_exhaustion()
                return

            self.dealer_hand.append(self.deck.pop())
            self.dealer_score = calculate_hand_value(self.dealer_hand)
            self.message += " Dealer hits."


        if self.dealer_score > 21:
            self.game_status = GameStatus.GAME_OVER.value
            self.result = GameResult.WIN.value
            self.message = GameMessage.DEALER_BUST.value
        else:
            # Compare scores
            if self.player_score > self.dealer_score:
                self.game_status = GameStatus.GAME_OVER.value
                self.result = GameResult.WIN.value
                self.message = GameMessage.PLAYER_WINS.value
            elif self.player_score < self.dealer_score:
                self.game_status = GameStatus.GAME_OVER.value
                self.result = GameResult.LOSE.value
                self.message = GameMessage.PLAYER_LOSES.value
            else:
                self.game_status = GameStatus.GAME_OVER.value
                self.result = GameResult.PUSH.value
                self.message = GameMessage.PLAYER_PUSH.value


    def handle_deck_exhaustion(self):
        """Handle case where deck runs out of cards"""
        self.game_status = GameStatus.GAME_OVER.value
        self.result = GameResult.PUSH.value
        self.message = GameMessage.DECK_EXHAUSTED.value


    def get_game_state_for_frontend(self, reveal_dealer_hand: bool = False) -> dict:
        """
        Prepares the game state to be sent to the frontend,
        hiding the dealer's second card if not revealed.
        """
        dealer_hand_for_frontend = []
        if self.dealer_hand:
            dealer_hand_for_frontend.append(str(self.dealer_hand[0])) # Always show first card
            if reveal_dealer_hand:
                # Show all dealer cards
                for card in self.dealer_hand[1:]:
                    dealer_hand_for_frontend.append(str(card))
            else:
                # Hide the second card and any subsequent cards
                dealer_hand_for_frontend.append(HIDDEN_CARD)


        return {
            "type": "game_state",
            "player_hand": [str(card) for card in self.player_hand],
            "dealer_hand": dealer_hand_for_frontend,
            "player_score": self.player_score,
            # Don't send full dealer score if not revealed, frontend can calculate visible score
            "dealer_score": calculate_hand_value([self.dealer_hand[0]]) if self.dealer_hand and not reveal_dealer_hand else 0,
            "game_status": self.game_status,
            "message": self.message,
            "result": self.result
        }


    def get_game_over_state_for_frontend(self) -> dict:
        """
        Prepares the final game state for the frontend when the game is over.
        """
        return {
            "type": "game_over",
            "player_hand": [str(card) for card in self.player_hand],
            "dealer_hand": [str(card) for card in self.dealer_hand], # All dealer cards revealed
            "player_score": self.player_score,
            "dealer_score": self.dealer_score, # Full dealer score revealed
            "game_status": self.game_status,
            "result": self.result,
            "message": self.message
        }