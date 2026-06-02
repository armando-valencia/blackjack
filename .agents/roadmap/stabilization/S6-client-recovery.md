# S6 — Client Connection Recovery

Branch: `feature/stabilization-client-recovery`

## Scope

- Add bounded automatic reconnect attempts with backoff.
- Show connection, reconnecting, and unavailable states.
- Disable controls while actions are unavailable or processing.
- Remove noisy production console logging.

## Acceptance criteria

- Temporary server restarts do not require a page refresh.
- Users understand when actions are unavailable.
- Rapid clicks do not send conflicting commands.

## Dependencies

- S2.
- S5.
