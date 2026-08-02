import asyncio
import websockets
import json
from game.logic import BlackjackGame
from utils import ControlMessageType, GameStatus, ServerMessageType

# Store active games and their connected clients
active_games = {}
game_clients = {}  # Maps game_id to list of websockets


async def send_action_result(websocket, action: str, accepted: bool, message: str):
    await websocket.send(
        json.dumps(
            {
                "type": ServerMessageType.ACTION_RESULT.value,
                "action": action,
                "accepted": accepted,
                "message": message,
            }
        )
    )


async def broadcast_to_clients(game_id: str, message: dict):
    """Broadcast a message to all clients connected to a game"""
    if game_id in game_clients:
        # Send to all connected clients
        disconnected_clients = []
        for client in game_clients[game_id]:
            try:
                await client.send(json.dumps(message))
            except websockets.exceptions.ConnectionClosed:
                disconnected_clients.append(client)

        # Clean up disconnected clients
        for client in disconnected_clients:
            game_clients[game_id].remove(client)


async def process_bot_turns(game: BlackjackGame, game_id: str):
    """
    Process all consecutive bot turns automatically.
    Broadcasts state after each bot action.
    """
    while game.game_status == GameStatus.PLAYING.value:
        current_player = game.players[game.current_player_index]

        # If current player is human, stop and wait for their input
        if current_player.is_human:
            break

        # Process bot turn
        await asyncio.sleep(0.8)  # Small delay for visual clarity
        bot_action = game.process_bot_turn()

        if bot_action["action"] is None:
            break

        # Broadcast updated state after bot action
        state = game.get_game_state_for_frontend()
        await broadcast_to_clients(game_id, state)

        # If bot's turn didn't end (they hit and didn't bust/reach 21), continue
        if not bot_action["turn_ended"]:
            # Bot will take another action
            continue
        else:
            # Bot's turn ended, check if next player is also a bot
            continue


async def handler(websocket):
    """Handles incoming websocket connections and game messages from clients"""
    print("Client connected")

    # For now, use a single shared game (Phase 1 - local multiplayer)
    # In Phase 2, we'll use room codes
    game_id = "default_game"

    if game_id not in active_games:
        game = BlackjackGame()
        active_games[game_id] = game
        game_clients[game_id] = []

    game = active_games[game_id]
    game_clients[game_id].append(websocket)

    try:
        # Send initial state
        initial_state = game.get_game_state_for_frontend()
        await websocket.send(json.dumps(initial_state))

        # Process incoming messages
        async for message in websocket:
            print(f"Received message: {message}")
            try:
                request = json.loads(message)
                print(f"Parsed request: {request}")

                if message_type := request.get("type"):
                    if message_type == ControlMessageType.SET_PLAYER_COUNT.value:
                        # Initialize game with specified number of players
                        num_players = request.get("num_players", 2)
                        game.initialize_players(num_players)
                        print(f"Initialized game with {num_players} players")

                        # Broadcast updated state to all clients
                        state = game.get_game_state_for_frontend()
                        await broadcast_to_clients(game_id, state)
                        await send_action_result(
                            websocket,
                            message_type,
                            True,
                            "Player count updated.",
                        )

                    elif message_type == ControlMessageType.DEAL_INITIAL.value:
                        game.deal_initial_hand()
                        print(f"Game status after dealing: {game.game_status}")

                        # Broadcast initial deal to all clients
                        state = game.get_game_state_for_frontend()
                        await broadcast_to_clients(game_id, state)
                        await send_action_result(
                            websocket,
                            message_type,
                            True,
                            "Hand dealt.",
                        )

                        # If first player is a bot, process bot turns
                        if game.game_status == GameStatus.PLAYING.value:
                            await process_bot_turns(game, game_id)

                    elif message_type == ControlMessageType.HIT.value:
                        if game.game_status == GameStatus.PLAYING.value:
                            current_player = game.players[game.current_player_index]

                            # Only allow human player to hit
                            if current_player.is_human:
                                game.player_hit()

                                # Broadcast updated state
                                state = game.get_game_state_for_frontend()
                                await broadcast_to_clients(game_id, state)

                                # If player didn't bust/stand, they can hit again
                                # If player's turn ended, process bot turns
                                if game.game_status == GameStatus.PLAYING.value:
                                    await process_bot_turns(game, game_id)
                                await send_action_result(
                                    websocket,
                                    message_type,
                                    True,
                                    "Hit accepted.",
                                )
                            else:
                                await send_action_result(
                                    websocket,
                                    message_type,
                                    False,
                                    "It is not your turn.",
                                )
                        else:
                            await send_action_result(
                                websocket,
                                message_type,
                                False,
                                "The game is not accepting actions.",
                            )

                    elif message_type == ControlMessageType.STAND.value:
                        if game.game_status == GameStatus.PLAYING.value:
                            current_player = game.players[game.current_player_index]

                            # Only allow human player to stand
                            if current_player.is_human:
                                game.player_stand()

                                # Broadcast updated state
                                state = game.get_game_state_for_frontend()
                                await broadcast_to_clients(game_id, state)

                                # Process bot turns after human stands
                                if game.game_status == GameStatus.PLAYING.value:
                                    await process_bot_turns(game, game_id)
                                await send_action_result(
                                    websocket,
                                    message_type,
                                    True,
                                    "Stand accepted.",
                                )
                            else:
                                await send_action_result(
                                    websocket,
                                    message_type,
                                    False,
                                    "It is not your turn.",
                                )
                        else:
                            await send_action_result(
                                websocket,
                                message_type,
                                False,
                                "The game is not accepting actions.",
                            )

            except json.JSONDecodeError:
                print(f"Invalid JSON received: {message}")
                await websocket.send(
                    json.dumps(
                        {
                            "type": ServerMessageType.ERROR.value,
                            "message": "Invalid JSON format.",
                        }
                    )
                )
            except Exception as e:
                print(f"Error processing message: {e}")
                import traceback
                traceback.print_exc()
                await websocket.send(
                    json.dumps(
                        {
                            "type": ServerMessageType.ERROR.value,
                            "message": f"Server error: {e}",
                        }
                    )
                )

    except websockets.exceptions.ConnectionClosedOK:
        print("Client disconnected normally")
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"Client disconnected with error: {e}")
    finally:
        print("Client connection closed")
        # Remove websocket from game clients
        if game_id in game_clients and websocket in game_clients[game_id]:
            game_clients[game_id].remove(websocket)

        # Clean up game if no clients left
        if game_id in game_clients and len(game_clients[game_id]) == 0:
            print(f"No clients left for game {game_id}, cleaning up")
            del game_clients[game_id]
            if game_id in active_games:
                del active_games[game_id]
