import asyncio

from game.session import GameSession
from utils import ControlMessageType


def test__add_client__tracks_unique_clients():
    session = GameSession()
    first_client = object()
    second_client = object()

    session.add_client(first_client)
    session.add_client(first_client)
    session.add_client(second_client)

    assert set(session.get_clients()) == {first_client, second_client}
    assert session.is_empty() is False


def test__remove_client__cleans_up_client_and_empty_state():
    session = GameSession()
    client = object()
    session.add_client(client)

    session.remove_client(client)

    assert session.get_clients() == ()
    assert session.is_empty() is True


def test__execute_command__serializes_game_commands():
    session = GameSession()
    requests = [
        {"type": ControlMessageType.SET_PLAYER_COUNT.value, "num_players": 1},
    ]

    results = asyncio.run(execute_commands(session, requests))

    assert len(results) == 1
    assert results[0].state["players"][0]["name"] == "You"


async def execute_commands(session: GameSession, requests: list[dict]):
    results = []
    for request in requests:
        results.append(await session.execute_command(request))
    return results
