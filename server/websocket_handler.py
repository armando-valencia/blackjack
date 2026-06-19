import asyncio
import json

import websockets

from command_validation import CommandValidationError
from game.session import GameSession
from utils import ServerMessageType

active_games: dict[str, GameSession] = {}
active_games_lock = asyncio.Lock()


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


async def get_or_create_game_session(game_id: str, websocket) -> GameSession:
    async with active_games_lock:
        if game_id not in active_games:
            active_games[game_id] = GameSession()
        session = active_games[game_id]
        session.add_client(websocket)
        return session


async def broadcast_to_clients(session: GameSession, message: dict):
    serialized_message = json.dumps(message)
    disconnected_clients = []
    for client in session.get_clients():
        try:
            await client.send(serialized_message)
        except websockets.exceptions.ConnectionClosed:
            disconnected_clients.append(client)

    if disconnected_clients:
        async with active_games_lock:
            for client in disconnected_clients:
                session.remove_client(client)


async def process_bot_turns(session: GameSession):
    while await session.has_active_bot_turn():
        await asyncio.sleep(0.8)
        bot_result = await session.process_bot_turn()
        if bot_result is None:
            return
        await broadcast_to_clients(session, bot_result.state)


async def remove_client_from_session(game_id: str, session: GameSession, websocket) -> None:
    async with active_games_lock:
        session.remove_client(websocket)
        if session.is_empty() and active_games.get(game_id) is session:
            del active_games[game_id]


async def handler(websocket):
    game_id = "default_game"
    session = await get_or_create_game_session(game_id, websocket)

    try:
        await websocket.send(json.dumps(await session.get_state()))

        async for message in websocket:
            try:
                request = json.loads(message)
                command_result = await session.execute_command(request)
                await broadcast_to_clients(session, command_result.state)
                await send_action_result(
                    websocket,
                    command_result.action,
                    True,
                    command_result.message,
                )
                await process_bot_turns(session)
            except json.JSONDecodeError:
                await send_error(websocket, "Invalid JSON format.")
            except CommandValidationError as error:
                if error.action is None:
                    await send_error(websocket, str(error))
                else:
                    await send_action_result(websocket, error.action, False, str(error))
            except Exception:
                await send_error(websocket, "Unable to process command.")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        await remove_client_from_session(game_id, session, websocket)
