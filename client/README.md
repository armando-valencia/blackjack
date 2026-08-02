# Blackjack Client

The client is a Vite React application that communicates with the Python WebSocket server at `ws://localhost:8765`.

## Commands

Run these commands from the repository root:

```bash
npm ci --prefix client
npm --prefix client run dev
```

Run client linting, tests, and the production build:

```bash
npm --prefix client run check
```

Run Vitest in watch mode:

```bash
npm --prefix client run test:watch
```

For complete setup instructions, see the [root README](../README.md).
