# S3 — Command Validation

Branch: `feature/stabilization-command-validation`

## Scope

- Validate player counts, game phase, action ownership, and duplicate commands.
- Return safe user-facing errors without raw exception details.
- Prevent invalid setup commands during an active hand.
- Add tests for rejected commands and malformed payloads.

## Acceptance criteria

- A client cannot advance another player’s turn.
- Invalid commands never crash the handler.
- Errors are actionable without exposing stack traces or implementation details.

## Dependencies

- S1.
- S2.
