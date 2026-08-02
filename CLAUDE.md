# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-player Blackjack game with a React frontend (Vite + TypeScript + Tailwind CSS) and Python backend (WebSocket server) communicating via WebSockets on localhost:8765.

## Development Commands

### Backend (Python)

```bash
# From project root - activate virtual environment
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r server/requirements.txt

# Run server (listens on ws://localhost:8765)
python server/main.py  # python3 on macOS/Linux

# Deactivate virtual environment when done
deactivate
```

### Frontend (React)

```bash
# From client/ directory
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # TypeScript compile + production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Architecture

### Backend Structure

- **[server/main.py](server/main.py)**: Entry point - starts WebSocket server on localhost:8765
- **[server/websocket_handler.py](server/websocket_handler.py)**: WebSocket transport - manages connections, JSON messages, broadcasting, and bot-turn timing
- **[server/game/service.py](server/game/service.py)**: Transport-independent command service that validates and executes game commands
- **[server/game/session.py](server/game/session.py)**: Owns one shared game service, connected clients, and serialized command access
- **[server/game/state_serializer.py](server/game/state_serializer.py)**: Converts game state into the client protocol shape
- **[server/game/logic.py](server/game/logic.py)**: Core game logic in `BlackjackGame` class - manages deck, hands, scoring, and game states (waiting/playing/dealer_turn/game_over)
- **[server/game/cards.py](server/game/cards.py)**: Card and deck creation
- **[server/game/hand.py](server/game/hand.py)**: Hand value calculation (handles Aces as 1 or 11)
- **[server/utils.py](server/utils.py)**: Enums for game state, results, actions, protocol messages, and user-facing game messages

### Frontend Structure

- **[client/src/App.tsx](client/src/App.tsx)**: Main component - establishes WebSocket connection, handles messages, renders game UI
- **[client/src/components/Card.tsx](client/src/components/Card.tsx)**: Displays individual card
- **[client/src/interfaces/game_interfaces.ts](client/src/interfaces/game_interfaces.ts)**: TypeScript types for WebSocket state, action-result, error, and control messages

### Communication Protocol

**Client → Server** (ControlMessage):

```json
{"type": "deal_initial"}  // Start new hand
{"type": "hit"}           // Player requests card
{"type": "stand"}         // Player ends turn
```

**Server → Client** (ServerMessage):

```json
// During gameplay - dealer's hole card hidden
{"type": "game_state", "players": [...], "dealer_hand": [..., "Hidden"], "dealer_score": 10, "game_status": "playing", "message": "..."}

// Game over - all cards revealed
{"type": "game_over", "players": [...], "dealer_hand": [...], "dealer_score": 19, "game_status": "game_over", "message": "..."}

// Command result
{"type": "action_result", "action": "hit", "accepted": true, "message": "Hit accepted."}

// Errors
{"type": "error", "message": "..."}
```

### Key Implementation Details

- **Dealer's Hidden Card**: During player's turn, `serialize_game_state()` sends dealer's first card and "Hidden" placeholder. On game over, the same serializer reveals all dealer cards.
- **Game Flow**: `deal_initial_hand()` → `player_hit()` (repeatable) → `player_stand()` → `dealer_turn()` (automatic, dealer hits until 17+) → game over
- **State Management**: Connections share a `GameSession` for the local game; the session owns connected clients and serializes commands. Empty sessions are removed after the final disconnect.
- **Immediate Blackjack**: If either player gets 21 on initial deal, game immediately transitions to game_over state.

## Tech Stack Notes

- Frontend uses **Vite** with **SWC** plugin for fast React compilation
- Styling via **Tailwind CSS v4** (using Vite plugin)
- Backend uses **websockets** library (only dependency)
- TypeScript strict mode enabled ([client/tsconfig.json](client/tsconfig.json))

## Additional Notes

- NEVER use any emojis in any code you write.
