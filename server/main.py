import asyncio
import websockets
import websocket_handler

HOST = "localhost"
PORT = 8765

async def main():
    """Starts the websocket server"""
    async with websockets.serve(websocket_handler.handler, HOST, PORT):
        print(f"WebSocket server started on ws://{HOST}:{PORT}")
        # Keep the server running until interrupted
        await asyncio.Future()


if __name__ == "__main__":
    """
    Runs the main server function when the script is executed.
    Handles a KeyboardInterrupt (Ctrl+C) to stop the server gracefully.
    """
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped.") # Added a newline for cleaner output on interrupt
