import asyncio
import websockets
import json
from game.service import GameService
from command_validation import CommandValidationError
from utils import ServerMessageType

# Store active games and their connected clients
active_games: dict[str, GameService] = {}
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


async def process_bot_turns(game_service: GameService, game_id: str):
    """
    Process all consecutive bot turns automatically.
    Broadcasts state after each bot action.
    """
    while game_service.has_active_bot_turn():
        await asyncio.sleep(0.8)  # Small delay for visual clarity
        bot_result = game_service.process_bot_turn()

        if bot_result is None:
            break

        await broadcast_to_clients(game_id, bot_result.state)


async def handler(websocket):
    """Handles incoming websocket connections and game messages from clients"""
    print("Client connected")

    # For now, use a single shared game (Phase 1 - local multiplayer)
    # In Phase 2, we'll use room codes
    game_id = "default_game"

    if game_id not in active_games:
        active_games[game_id] = GameService()
        game_clients[game_id] = []

    game_service = active_games[game_id]
    game_clients[game_id].append(websocket)

    try:
        # Send initial state
        initial_state = game_service.get_state()
        await websocket.send(json.dumps(initial_state))

        # Process incoming messages
        async for message in websocket:
            print(f"Received message: {message}")
            try:
                request = json.loads(message)
                print(f"Parsed request: {request}")
                command_result = game_service.execute_command(request)
                await broadcast_to_clients(game_id, command_result.state)
                await send_action_result(
                    websocket,
                    command_result.action,
                    True,
                    command_result.message,
                )
                await process_bot_turns(game_service, game_id)

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
