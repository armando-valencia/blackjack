import asyncio
import websockets

async def echo(websocket, path):
    """
    Handles incoming websocket connections and echoes received messages.
    """
    print("Client connected")
    try:
        # Receive messages from the client
        async for message in websocket:
            print(f"Received message: {message}")
            # Send the received message back to the client with an "Echo: " prefix
            await websocket.send(f"Echo: {message}")
    except websockets.exceptions.ConnectionClosedOK:
        # This exception is raised when a client closes the connection normally
        print("Client disconnected normally")
    except websockets.exceptions.ConnectionClosedError as e:
        # This exception is raised for other connection errors
        print(f"Client disconnected with error: {e}")
    finally:
        # This block is executed regardless of whether an exception occurred
        print("Client connection closed")


async def main():
    """
    Starts the websocket server.
    """
    # Start the websocket server:
    # - echo: the coroutine function to handle each connection
    # - "localhost": the address to bind the server to
    # - 8765: the port to listen on (you can change this if needed)
    async with websockets.serve(echo, "localhost", 8765):
        print("WebSocket server started on ws://localhost:8765")
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

