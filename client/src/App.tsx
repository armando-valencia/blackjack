import React, { useEffect, useState } from "react";
import "./App.css";

type Message = string;

function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState<string>("");
	const [websocket, setWebsocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		console.log("Attempting to connect to WebSocket...");
		const ws = new WebSocket("ws://localhost:8765");

		ws.onopen = () => {
			console.log("WebSocket connection established");
			setMessages((prevMessages) => [
				...prevMessages,
				"Connected to server",
			]);
		};

		ws.onmessage = (event: MessageEvent) => {
			console.log("Message from server:", event.data);
			setMessages((prevMessages) => [
				...prevMessages,
				`Server: ${event.data}`,
			]);
		};

		ws.onerror = () => {
			console.error("WebSocket error: See console for details.");
			setMessages((prevMessages) => [
				...prevMessages,
				`WebSocket Error: See console for details.`,
			]);
		};

		ws.onclose = (event: CloseEvent) => {
			console.log(
				"WebSocket connection closed:",
				event.code,
				event.reason
			);
			setMessages((prevMessages) => [
				...prevMessages,
				"Disconnected from server",
			]);
			setWebsocket(null);
		};

		setWebsocket(ws);

		return () => {
			console.log("Cleaning up WebSocket connection...");
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
				console.log("WebSocket connection closed by cleanup");
			}
		};
	}, []);

	const sendMessage = () => {
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			console.log("Sending message:", inputMessage);
			websocket.send(inputMessage);
			setMessages((prevMessages) => [
				...prevMessages,
				`Client: ${inputMessage}`,
			]);
			setInputMessage("");
		} else {
			console.error("WebSocket is not connected.");
			setMessages((prevMessages) => [
				...prevMessages,
				"Error: Not connected to server",
			]);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-4">WebSocket Demo</h1>
			<div className="w-full max-w-md bg-white p-6 rounded shadow-md">
				<div className="mb-4 h-40 overflow-y-auto border p-2 rounded bg-gray-50">
					{messages.map((msg, index) => (
						<p key={index} className="text-sm break-words">
							{msg}
						</p>
					))}
				</div>
				<div className="flex">
					<input
						type="text"
						className="flex-grow p-2 border rounded-l focus:outline-none focus:ring focus:border-blue-300"
						value={inputMessage}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setInputMessage(e.target.value)
						}
						placeholder="Type a message..."
						onKeyPress={(
							e: React.KeyboardEvent<HTMLInputElement>
						) => {
							if (e.key === "Enter") {
								sendMessage();
							}
						}}
					/>
					<button
						onClick={sendMessage}
						className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
					>
						Send
					</button>
				</div>
				{!websocket || websocket.readyState !== WebSocket.OPEN ? (
					<p className="mt-2 text-center text-red-500">
						Not connected. Ensure the Python server is running.
					</p>
				) : null}
			</div>
		</div>
	);
}

export default App;
