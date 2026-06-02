# Blackjack Roadmap

The work is ordered into three phases:

1. Stabilize the application.
2. Redesign the table experience.
3. Improve mobile support.

Each phase has an index and one small document per proposed PR. Read only the selected item and its dependencies before implementation.

## Current starting point

Start with `stabilization/S1-game-rule-tests.md`. It adds regression coverage before state, transport, and UI changes begin.

## Definition of done

- One focused branch and PR.
- Relevant tests, lint, or build checks pass.
- No unrelated formatting or dependency churn.
- Existing behavior is preserved unless the item explicitly changes it.
- Handoff includes validation, limitations, and a suggested commit message.
