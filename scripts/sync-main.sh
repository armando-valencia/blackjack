#!/usr/bin/env bash

set -eu

repository_root="$(git rev-parse --show-toplevel)"
cd "$repository_root"

if ! git diff --quiet || ! git diff --cached --quiet; then
	printf '%s\n' "Tracked changes are present; refusing to switch branches."
	exit 1
fi

git switch main
git pull --ff-only
git status --short --branch
