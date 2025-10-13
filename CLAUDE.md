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
- **[server/websocket_handler.py](server/websocket_handler.py)**: WebSocket handler - manages connections, routes messages, maintains one `BlackjackGame` instance per WebSocket connection in `active_games` dict
- **[server/game/logic.py](server/game/logic.py)**: Core game logic in `BlackjackGame` class - manages deck, hands, scoring, game states (waiting/player_turn/dealer_turn/game_over)
- **[server/game/cards.py](server/game/cards.py)**: Card and deck creation
- **[server/game/hand.py](server/game/hand.py)**: Hand value calculation (handles Aces as 1 or 11)
- **[server/utils.py](server/utils.py)**: Enums for GameStatus, GameResult, GameMessage

### Frontend Structure

- **[client/src/App.tsx](client/src/App.tsx)**: Main component - establishes WebSocket connection, handles messages, renders game UI
- **[client/src/components/Hand.tsx](client/src/components/Hand.tsx)**: Displays a hand of cards with score
- **[client/src/components/Card.tsx](client/src/components/Card.tsx)**: Displays individual card
- **[client/src/interfaces/game_interfaces.ts](client/src/interfaces/game_interfaces.ts)**: TypeScript types for WebSocket messages (ServerMessage, ControlMessage, GameState, GameOverState)

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
{"type": "game_state", "player_hand": [...], "dealer_hand": [..., "Hidden"], "player_score": 18, "dealer_score": 10, "game_status": "player_turn", "message": "...", "result": null}

// Game over - all cards revealed
{"type": "game_over", "player_hand": [...], "dealer_hand": [...], "player_score": 20, "dealer_score": 19, "game_status": "game_over", "result": "win", "message": "..."}

// Errors
{"type": "error", "message": "..."}
```

### Key Implementation Details

- **Dealer's Hidden Card**: During player's turn, `get_game_state_for_frontend()` sends dealer's first card and "Hidden" placeholder. On game over, `get_game_over_state_for_frontend()` reveals all dealer cards.
- **Game Flow**: `deal_initial_hand()` → `player_hit()` (repeatable) → `player_stand()` → `dealer_turn()` (automatic, dealer hits until 17+) → game over
- **State Management**: Each WebSocket connection gets its own `BlackjackGame` instance stored in `active_games` dict (keyed by websocket). Instance is deleted on disconnect.
- **Immediate Blackjack**: If either player gets 21 on initial deal, game immediately transitions to game_over state with 1-second delay for dramatic effect.

## Tech Stack Notes

- Frontend uses **Vite** with **SWC** plugin for fast React compilation
- Styling via **Tailwind CSS v4** (using Vite plugin)
- Backend uses **websockets** library (only dependency)
- TypeScript strict mode enabled ([client/tsconfig.json](client/tsconfig.json))

## Additional Notes

- NEVER use any emojis in any code you write.
