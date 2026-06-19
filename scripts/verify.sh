#!/usr/bin/env bash

set -eu

repository_root="$(git rev-parse --show-toplevel)"
cd "$repository_root"

if [ -x "$repository_root/.venv/bin/python" ]; then
	python_command="$repository_root/.venv/bin/python"
else
	python_command="python3"
fi

"$python_command" -m pytest server/tests
npm --prefix client run check
