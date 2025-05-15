import asyncio
import websockets
import json
from game.logic import BlackjackGame

active_games = {}

async def handler(websocket):
    """Handles incoming websocket connections and game messages."""
    print("Client connected")
    game = BlackjackGame()
    active_games[websocket] = game # Store the game instance

    try:
        # Send initial state (waiting for deal)
        initial_state = game.get_game_state_for_frontend()
        await websocket.send(json.dumps(initial_state))

        # Process incoming messages
        async for message in websocket:
            print(f"Received message: {message}")
            try:
                request = json.loads(message) # Parse the incoming JSON

                print(f"Parsed request: {request}")
                message_type = request.get("type")

                if message_type == "deal_initial":
                    game.deal_initial_hand()
                    print(f"Game status after dealing: {game.game_status}")
                    # Send the initial game state (dealer's second card hidden)
                    await websocket.send(json.dumps(game.get_game_state_for_frontend()))
                    # If game is over immediately (Blackjack), send game_over state
                    if game.game_status == "game_over":
                         await asyncio.sleep(1) # Small delay for dramatic effect
                         await websocket.send(json.dumps(game.get_game_over_state_for_frontend()))

                elif message_type == "hit":
                    if game.game_status == "player_turn":
                        game_over_after_hit = game.player_hit()
                        # Send the updated game state (dealer's second card still hidden)
                        await websocket.send(json.dumps(game.get_game_state_for_frontend()))
                        if game_over_after_hit: # If bust after hitting
                            await asyncio.sleep(1)
                            await websocket.send(json.dumps(game.get_game_over_state_for_frontend()))

                elif message_type == "stand":
                    if game.game_status == "player_turn":
                        game.player_stand()
                        # Send final game state (all cards revealed)
                        await websocket.send(json.dumps(game.get_game_over_state_for_frontend()))


                # TODO: Add error handling for invalid message types or game states

            except json.JSONDecodeError:
                print(f"Invalid JSON received: {message}")
                # Optionally send an error message back to the client
                await websocket.send(json.dumps({"type": "error", "message": "Invalid JSON format."}))
            except Exception as e:
                 print(f"Error processing message: {e}")
                 import traceback; traceback.print_exc()
                 await websocket.send(json.dumps({"type": "error", "message": f"Server error: {e}"}))


    except websockets.exceptions.ConnectionClosedOK:
        print("Client disconnected normally")
    except websockets.exceptions.ConnectionClosedError as e:
        print(f"Client disconnected with error: {e}")
    finally:
        print("Client connection closed")
        # Clean up the game instance when the client disconnects
        if websocket in active_games:
            del active_games[websocket]
