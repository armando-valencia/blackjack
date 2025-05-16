import asyncio
import websockets
import websocket_handler

HOST = "localhost"
PORT = 8765

async def main():
    async with websockets.serve(websocket_handler.handler, HOST, PORT):
        print(f"WebSocket server started on ws://{HOST}:{PORT}")
        # Keep the server running until interrupted
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped.")
