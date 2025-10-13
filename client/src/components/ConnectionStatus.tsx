import React from "react";

interface ConnectionStatusProps {
	status: "connecting" | "connected" | "disconnected" | "error";
	hasError: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, hasError }) => {
	const statusConfig = {
		connecting: {
			color: "bg-yellow-400",
			text: "Connecting...",
			pulse: true,
		},
		connected: {
			color: "bg-emerald-400",
			text: "Connected",
			pulse: false,
		},
		disconnected: {
			color: "bg-red-400",
			text: "Disconnected",
			pulse: true,
		},
		error: {
			color: "bg-red-400",
			text: "Disconnected",
			pulse: true,
		},
	};

	const config = statusConfig[status];

	if (status === "connected" && !hasError) {
		return null;
	}

	return (
		<div className="absolute top-4 right-4 z-50">
			<div className="flex items-center gap-2 px-3 py-2 glass rounded-full">
				<div className={`w-2 h-2 ${config.color} rounded-full ${config.pulse ? "animate-pulse" : ""}`} />
				<span className="text-xs text-white/80 hidden sm:inline">{config.text}</span>
			</div>
		</div>
	);
};

export default ConnectionStatus;
