# S5 — Game Lifecycle Safety

Branch: `feature/stabilization-game-lifecycle`

## Scope

- Define connection ownership and lifecycle behavior for the shared local game.
- Prevent clients from unexpectedly reinitializing an active game.
- Handle disconnects, empty games, and reconnects cleanly.
- Serialize commands per game to avoid state races.

## Acceptance criteria

- Disconnects do not leave stale clients or games.
- Concurrent actions are processed deterministically.
- Reconnecting clients receive a valid current state.

## Dependencies

- S3.
- S4.
