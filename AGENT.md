# Local Blackjack Workflow

This file is local project guidance for Codex and must remain untracked. It is not production documentation.

## Working rules

- Work on one roadmap item at a time.
- Create one branch per roadmap item; never commit or push automatically.
- Keep PRs focused on one behavior or cohesive refactor.
- Choose the simplest implementation that fully satisfies the requirements.
- Make architectural decisions for the long term; do not introduce stopgaps intended to be replaced later.
- Prefer a small, complete design over a narrow patch that creates avoidable follow-up work.
- Preserve unrelated user changes.
- Prefer well-named code over comments. Add comments only when naming cannot express the intent.
- Do not use one-letter variables or ambiguous function names.
- Python test names must follow `test__<function name>__<test case>`.
- Run only the checks relevant to the current PR, then report results and a suggested commit message.

## Planning workflow

1. Read `.agents/roadmap/README.md` and the relevant phase index.
2. Read only the selected PR file and its listed dependencies.
3. Confirm the working tree before editing.
4. Create the item’s branch if it does not exist.
5. Implement only the selected item.
6. Validate the item and inspect the final diff.
7. Hand off changed files, checks, known limitations, and a suggested commit message.

## Roadmap locations

- Overview: `.agents/roadmap/README.md`
- Stabilization: `.agents/roadmap/stabilization/README.md`
- Table redesign: `.agents/roadmap/table/README.md`
- Mobile support: `.agents/roadmap/mobile/README.md`
- Decisions: `.agents/roadmap/decisions.md`

## Local-file rule

Everything under `.agents/` and this file is planning-only. Never stage, commit, or push these files.
