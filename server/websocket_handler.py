import asyncio
import websockets
import json
from game.logic import BlackjackGame
from command_validation import CommandValidationError, validate_command
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


async def send_error(websocket, message: str):
    await websocket.send(
        json.dumps(
            {
                "type": ServerMessageType.ERROR.value,
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
                message_type, requested_player_count = validate_command(game, request)

                if message_type == ControlMessageType.SET_PLAYER_COUNT.value:
                    game.initialize_players(requested_player_count)
                    print(f"Initialized game with {requested_player_count} players")

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

                    state = game.get_game_state_for_frontend()
                    await broadcast_to_clients(game_id, state)
                    await send_action_result(
                        websocket,
                        message_type,
                        True,
                        "Hand dealt.",
                    )

                    if game.game_status == GameStatus.PLAYING.value:
                        await process_bot_turns(game, game_id)

                elif message_type == ControlMessageType.HIT.value:
                    game.player_hit()
                    state = game.get_game_state_for_frontend()
                    await broadcast_to_clients(game_id, state)
                    if game.game_status == GameStatus.PLAYING.value:
                        await process_bot_turns(game, game_id)
                    await send_action_result(websocket, message_type, True, "Hit accepted.")

                elif message_type == ControlMessageType.STAND.value:
                    game.player_stand()
                    state = game.get_game_state_for_frontend()
                    await broadcast_to_clients(game_id, state)
                    if game.game_status == GameStatus.PLAYING.value:
                        await process_bot_turns(game, game_id)
                    await send_action_result(websocket, message_type, True, "Stand accepted.")

            except json.JSONDecodeError:
                print(f"Invalid JSON received: {message}")
                await send_error(websocket, "Invalid JSON format.")
            except CommandValidationError as error:
                if error.action is None:
                    await send_error(websocket, str(error))
                else:
                    await send_action_result(websocket, error.action, False, str(error))
            except Exception as e:
                print(f"Error processing message: {e}")
                import traceback
                traceback.print_exc()
                await send_error(websocket, "Unable to process command.")

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
