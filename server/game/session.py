import asyncio

from game.service import CommandResult, GameService


class GameSession:
    def __init__(self):
        self.game_service = GameService()
        self.clients: set[object] = set()
        self.command_lock = asyncio.Lock()

    def add_client(self, client: object) -> None:
        self.clients.add(client)

    def remove_client(self, client: object) -> None:
        self.clients.discard(client)

    def get_clients(self) -> tuple[object, ...]:
        return tuple(self.clients)

    def is_empty(self) -> bool:
        return not self.clients

    async def get_state(self) -> dict:
        async with self.command_lock:
            return self.game_service.get_state()

    async def execute_command(self, request: object) -> CommandResult:
        async with self.command_lock:
            return self.game_service.execute_command(request)

    async def process_bot_turn(self) -> CommandResult | None:
        async with self.command_lock:
            if not self.game_service.has_active_bot_turn():
                return None
            return self.game_service.process_bot_turn()

    async def has_active_bot_turn(self) -> bool:
        async with self.command_lock:
            return self.game_service.has_active_bot_turn()
