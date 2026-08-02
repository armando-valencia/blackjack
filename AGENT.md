# Local Blackjack Workflow

This file is local project guidance for Codex and must remain untracked. It is not production documentation.

## Working rules

- Work on one roadmap item at a time.
- Create one branch per roadmap item; never commit or push automatically.
- Keep PRs focused on one behavior or cohesive refactor.
- Choose the simplest implementation that fully satisfies the requirements.
- Make architectural decisions for the long term; do not introduce stopgaps intended to be replaced later.
- Prefer a small, complete design over a narrow patch that creates avoidable follow-up work.
- Use dataclasses for simple data containers when they improve clarity; use regular classes for objects with meaningful behavior or complex initialization.
- When repeated domain values appear, model them as named domain types or constants in the owning module rather than duplicating magic strings in tests and production code.
- Keep test helpers close to the domain they exercise; do not hide production concepts behind test-only replacement constants.
- Before closing stabilization, audit the repository for repeated domain and protocol magic strings and address them in a dedicated or feature-related change.
- Preserve unrelated user changes.
- Prefer well-named code over comments. Add comments only when naming cannot express the intent.
- Keep docstrings to one concise sentence, preferably on a single line; move lengthy explanations into naming, tests, or documentation.
- Do not use one-letter variables or ambiguous function names.
- Python test names must follow `test__<function name>__<test case>`.
- Run only the checks relevant to the current PR, then report results and a suggested commit message.
- Every completed feature handoff must include a suggested commit message that is one sentence maximum.
- Suggested commit messages should sound natural and human-written, describe the actual change, and avoid generic or overly formal bot-like phrasing.

## Planning workflow

1. Read `.agents/roadmap/README.md` and the relevant phase index.
2. Read only the selected PR file and its listed dependencies.
3. Confirm the working tree before editing.
4. Create the item’s branch if it does not exist.
5. Track implementation progress and decisions in the selected PR file while working.
6. Implement only the selected item.
7. Validate the item and inspect the final diff.
8. Hand off changed files, checks, known limitations, and a one-sentence suggested commit message.

## Planning-file cleanup

- Keep phase indexes focused on work that is still planned or in progress.
- After a PR is merged, remove its planning file when no later item depends on it.
- Remove completed entries from the phase index at the same time.
- Do not remove planning files that still provide requirements or dependencies for active work.
- Remove temporary tracking files once their information has been transferred to the roadmap or handoff.

## Post-merge workflow

After a PR is merged:

1. Switch to `main`.
2. Pull the merged changes from the remote.
3. Confirm the working tree and branch are synchronized.
4. Create the next feature branch from the updated `main`.

Do not continue feature work from a stale branch after its PR has been merged.

Use `scripts/sync-main.sh` and `scripts/start-feature.sh` for this workflow when the working tree has no tracked changes.

## Roadmap locations

- Overview: `.agents/roadmap/README.md`
- Stabilization: `.agents/roadmap/stabilization/README.md`
- Table redesign: `.agents/roadmap/table/README.md`
- Mobile support: `.agents/roadmap/mobile/README.md`
- Decisions: `.agents/roadmap/decisions.md`

## Roadmap status

- Completed: S1, S1.5, S1.6, S2, S3, S4, S5, S6, S7, T1, T2, and T3.
- In progress: T4 — Action Rail.
- Pending: T5, T6, M1, M2, M3, M4, and M5.
- Update this snapshot after each merge before starting the next branch.

## Local-file rule

Everything under `.agents/` and this file is planning-only. Never stage, commit, or push these files.
