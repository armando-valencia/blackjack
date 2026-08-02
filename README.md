# Blackjack

A local multiplayer Blackjack game with a React frontend and Python WebSocket backend.

## Quick Start

### Prerequisites

- Python 3.12 or newer
- Node.js 18 or newer

Run the following from the repository root.

### 1. Install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r server/requirements.txt
npm ci --prefix client
```

On Windows PowerShell, activate the environment with `.\.venv\Scripts\activate` instead.

### 2. Start the server

In the first terminal:

```bash
python server/main.py
```

The WebSocket server listens on `ws://localhost:8765`.

### 3. Start the client

In a second terminal, from the repository root:

```bash
npm --prefix client run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Layout

| Path | Purpose |
| --- | --- |
| `client/` | React and Vite frontend. |
| `server/` | Python game rules and WebSocket backend. |
| `server/tests/` | Python rule and service tests. |
| `scripts/` | Local verification and Git workflow helpers. |

## Development Commands

Run all local quality checks from the repository root:

```bash
./scripts/verify.sh
```

This runs the Python test suite, client lint, Vitest tests, and production build.

Run the Python tests directly:

```bash
python -m pytest server/tests
```

Run client checks directly:

```bash
npm --prefix client run check
```

Run client tests in watch mode:

```bash
npm --prefix client run test:watch
```

## Architecture

The Python server owns the game session, Blackjack rules, player turns, and WebSocket messages. The React client renders the table, sends player actions, and handles connection recovery.

The local development endpoints are:

- Client: `http://localhost:5173`
- Server: `ws://localhost:8765`

## Git Workflow Helpers

After a pull request is merged, synchronize the local base branch:

```bash
./scripts/sync-main.sh
```

Start the next branch from the updated `main` branch:

```bash
./scripts/start-feature.sh feature/example-name
```

These helpers refuse tracked changes and never commit, push, stash, reset, or delete files.

## Current Scope

- Local multiplayer sessions with one human player and optional bots.
- Dealer and player turn handling over WebSockets.
- Responsive React client with reconnect handling.
- Client production builds with uploaded artifacts plus Python and client quality checks in GitHub Actions.
