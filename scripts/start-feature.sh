#!/usr/bin/env bash

set -eu

if [ "$#" -ne 1 ]; then
	printf 'Usage: %s <branch-name>\n' "$0"
	exit 2
fi

feature_branch="$1"
repository_root="$(git rev-parse --show-toplevel)"
cd "$repository_root"

if ! git check-ref-format --branch "$feature_branch" >/dev/null 2>&1; then
	printf '%s\n' "Invalid branch name."
	exit 2
fi

current_branch="$(git branch --show-current)"
if [ "$current_branch" != "main" ]; then
	printf '%s\n' "Start feature branches from main."
	exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
	printf '%s\n' "Tracked changes are present; refusing to create a branch."
	exit 1
fi

git pull --ff-only
git switch -c "$feature_branch"
git status --short --branch
