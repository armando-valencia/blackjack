from game.cards import Card, Rank, create_deck
from game.hand import calculate_hand_value
from game.player import PlayerState, PlayerStatus
from game.bot_player import get_random_bot_name, make_bot_decision
from utils import GameStatus, GameResult, GameMessage, PlayerAction


class BlackjackGame:
    def __init__(self):
        self.deck: list[Card] = create_deck()
        self.players: list[PlayerState] = []
        self.dealer_hand: list[Card] = []
        self.dealer_score: int = 0
        self.game_status: str = GameStatus.WAITING.value
        self.message: str = ""
        self.current_player_index: int = 0
        self.num_players: int = 0

    def _is_blackjack(self, hand: list[Card]) -> bool:
        """
        Check if a hand is a true Blackjack (Ace + 10-value card on initial deal).
        Only valid for 2-card hands.
        """
        if len(hand) != 2:
            return False

        has_ace = any(card.rank == Rank.ACE for card in hand)
        has_ten_value = any(
            card.rank in (Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING)
            for card in hand
        )

        return has_ace and has_ten_value

    def _get_turn_message(self, player_name: str) -> str:
        """Get grammatically correct turn message for a player"""
        if player_name == "You":
            return "Your turn"
        else:
            return f"{player_name}'s turn"

    def initialize_players(self, num_players: int):
        """
        Initialize players for the game.
        First player is human, rest are bots with random names.
        """
        self.num_players = num_players
        self.players = []
        used_names = set()

        # Create human player (always player 0)
        human_player = PlayerState(player_id=0, name="You", is_human=True)
        self.players.append(human_player)

        # Create bot players
        for i in range(1, num_players):
            bot_name = get_random_bot_name(used_names)
            used_names.add(bot_name)
            bot_player = PlayerState(player_id=i, name=bot_name, is_human=False)
            self.players.append(bot_player)

        self.current_player_index = 0
        self.game_status = GameStatus.WAITING.value
        self.message = "Ready to deal!"

    def reset_to_menu(self):
        self.deck = create_deck()
        self.players = []
        self.dealer_hand = []
        self.dealer_score = 0
        self.game_status = GameStatus.WAITING.value
        self.message = ""
        self.current_player_index = 0
        self.num_players = 0

    def deal_initial_hand(self):
        """Deal initial cards to all players and dealer"""
        if not self.players:
            raise ValueError("No players initialized. Call initialize_players first.")

        self.deck = create_deck()
        self.dealer_hand = []
        self.current_player_index = 0

        # Reset all players
        for player in self.players:
            player.reset_hand()

        self.message = GameMessage.DEALING.value

        # Deal two cards to each player
        for _ in range(2):
            for player in self.players:
                player.add_card(self.deck.pop())

        # Deal two cards to dealer
        self.dealer_hand.append(self.deck.pop())
        self.dealer_hand.append(self.deck.pop())
        self.dealer_score = calculate_hand_value(self.dealer_hand)

        # Check for dealer blackjack
        dealer_has_blackjack = self._is_blackjack(self.dealer_hand)

        # Check each player for blackjack
        all_players_done = True
        for player in self.players:
            player_has_blackjack = self._is_blackjack(player.hand)

            if player_has_blackjack and dealer_has_blackjack:
                player.status = PlayerStatus.DONE.value
                player.result = GameResult.PUSH.value
            elif player_has_blackjack:
                player.status = PlayerStatus.DONE.value
                player.result = GameResult.WIN.value
            elif dealer_has_blackjack:
                player.status = PlayerStatus.DONE.value
                player.result = GameResult.LOSE.value
            else:
                player.status = PlayerStatus.WAITING.value
                all_players_done = False

        # Determine game status
        if dealer_has_blackjack:
            self.game_status = GameStatus.GAME_OVER.value
            self.message = GameMessage.DEALER_BLACKJACK.value
        elif all_players_done:
            self.game_status = GameStatus.GAME_OVER.value
            self.message = "All players have Blackjack!"
        else:
            self.game_status = GameStatus.PLAYING.value
            # Find first player who needs to play
            self.current_player_index = self._find_next_active_player(start_index=-1)
            if self.current_player_index != -1:
                self.players[self.current_player_index].status = PlayerStatus.PLAYING.value
                self.message = self._get_turn_message(self.players[self.current_player_index].name)

    def _find_next_active_player(self, start_index: int) -> int:
        """
        Find the next player who needs to play (status is WAITING).
        Returns -1 if no more active players.
        """
        for i in range(start_index + 1, len(self.players)):
            if self.players[i].status == PlayerStatus.WAITING.value:
                return i
        return -1

    def advance_to_next_player(self):
        """Move to the next player's turn or dealer turn if all players done"""
        next_player_index = self._find_next_active_player(self.current_player_index)

        if next_player_index != -1:
            # Move to next player
            self.current_player_index = next_player_index
            self.players[self.current_player_index].status = PlayerStatus.PLAYING.value
            self.message = self._get_turn_message(self.players[self.current_player_index].name)
        else:
            # All players done, move to dealer turn
            self.game_status = GameStatus.DEALER_TURN.value
            self.message = GameMessage.DEALER_TURN.value
            self.dealer_turn()

    def player_hit(self, player_id: int | None = None) -> bool:
        """
        Player hits (draws a card).
        Returns True if this action ended the player's turn (bust or 21).
        """
        if self.game_status != GameStatus.PLAYING.value:
            return False

        # Default to current player if no player_id specified
        if player_id is None:
            player_id = self.current_player_index

        if player_id != self.current_player_index:
            return False  # Not this player's turn

        player = self.players[player_id]

        if player.status != PlayerStatus.PLAYING.value:
            return False

        # Check if deck is exhausted
        if not self.deck:
            self.handle_deck_exhaustion()
            return True

        player.add_card(self.deck.pop())
        self.message = f"{player.name} hits"

        if player.score > 21:
            # Player busts
            player.status = PlayerStatus.BUST.value
            player.result = GameResult.LOSE.value
            self.message = f"{player.name} busts!"
            self.advance_to_next_player()
            return True
        elif player.score == 21:
            # Auto-stand at 21
            player.status = PlayerStatus.STANDING.value
            self.message = f"{player.name} stands at 21"
            self.advance_to_next_player()
            return True

        return False

    def player_stand(self, player_id: int | None = None):
        """Player stands (ends their turn)"""
        if self.game_status != GameStatus.PLAYING.value:
            return

        # Default to current player if no player_id specified
        if player_id is None:
            player_id = self.current_player_index

        if player_id != self.current_player_index:
            return  # Not this player's turn

        player = self.players[player_id]

        if player.status != PlayerStatus.PLAYING.value:
            return

        player.status = PlayerStatus.STANDING.value
        self.message = f"{player.name} stands"
        self.advance_to_next_player()

    def process_bot_turn(self) -> dict:
        """
        Process the current bot player's turn.
        Returns action taken ("hit" or "stand") and whether turn ended.
        """
        if self.game_status != GameStatus.PLAYING.value:
            return {"action": None, "turn_ended": False}

        current_player = self.players[self.current_player_index]

        if current_player.is_human or current_player.status != PlayerStatus.PLAYING.value:
            return {"action": None, "turn_ended": False}

        # Get dealer's upcard value
        dealer_upcard_value = calculate_hand_value([self.dealer_hand[0]])

        # Bot makes decision
        action = make_bot_decision(current_player.score, dealer_upcard_value)

        if action == PlayerAction.HIT.value:
            turn_ended = self.player_hit(self.current_player_index)
            return {"action": PlayerAction.HIT.value, "turn_ended": turn_ended}
        else:  # stand
            self.player_stand(self.current_player_index)
            return {"action": PlayerAction.STAND.value, "turn_ended": True}

    def dealer_turn(self):
        """Dealer plays their hand"""
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

        # Determine results for each player
        dealer_bust = self.dealer_score > 21

        for player in self.players:
            # Skip players who already have results (busted or blackjack)
            if player.result is not None:
                player.status = PlayerStatus.DONE.value
                continue

            if dealer_bust:
                player.result = GameResult.WIN.value
            elif player.score > self.dealer_score:
                player.result = GameResult.WIN.value
            elif player.score < self.dealer_score:
                player.result = GameResult.LOSE.value
            else:
                player.result = GameResult.PUSH.value

            player.status = PlayerStatus.DONE.value

        self.game_status = GameStatus.GAME_OVER.value

        if dealer_bust:
            self.message = f"Dealer busts with {self.dealer_score}!"
        else:
            self.message = f"Dealer stands at {self.dealer_score} - Game Over"

    def handle_deck_exhaustion(self):
        """Handle case where deck runs out of cards"""
        self.game_status = GameStatus.GAME_OVER.value

        # Set all remaining players to push
        for player in self.players:
            if player.result is None:
                player.result = GameResult.PUSH.value
                player.status = PlayerStatus.DONE.value

        self.message = GameMessage.DECK_EXHAUSTED.value
