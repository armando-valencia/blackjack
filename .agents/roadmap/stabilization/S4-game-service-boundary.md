# S4 — Game Service Boundary

Branch: `refactor/stabilization-game-service-boundary`

## Scope

- Keep blackjack rules in a transport-independent game service.
- Move parsing, broadcasting, and connection lifecycle concerns out of the rules layer.
- Create a small command dispatcher that is straightforward to test.

## Acceptance criteria

- Rules are testable without a WebSocket.
- Transport code does not manipulate internal game fields unnecessarily.
- Existing gameplay behavior remains unchanged.

## Dependencies

- S1.
- S2.
- S3.
