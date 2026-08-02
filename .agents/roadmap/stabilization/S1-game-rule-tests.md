# S1 — Game Rule Test Foundation

Branch: `feature/stabilization-game-rule-tests`

## Scope

- Add Python test tooling and a focused test layout.
- Cover hand scoring, ace handling, blackjack detection, busts, standing, dealer resolution, ties, and deck exhaustion.
- Make deck order deterministic in tests without changing gameplay behavior.
- Use `test__<function name>__<test case>` names.

## Acceptance criteria

- Tests run from a documented command.
- Core rules have regression coverage.
- Production behavior is unchanged except for testability improvements.

## Dependencies

None.
