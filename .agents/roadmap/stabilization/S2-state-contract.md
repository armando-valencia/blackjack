# S2 — State and Protocol Contract

Branch: `feature/stabilization-state-contract`

## Scope

- Define one canonical set of game-status values on server and client.
- Remove stale or unused protocol types and components where appropriate.
- Add explicit action/result shapes for successful and rejected commands.
- Update protocol documentation to match the actual state model.

## Acceptance criteria

- Conflicting `player_turn` and `playing` terminology is removed.
- Client types match serialized server state.
- Invalid or unavailable actions have predictable responses.

## Dependencies

- S1.
