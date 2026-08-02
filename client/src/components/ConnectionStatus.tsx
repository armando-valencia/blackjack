import React from "react";
import { CONNECTION_STATUS } from "../constants";
import type { ConnectionStatus as ConnectionStatusValue } from "../interfaces/game_interfaces";

interface ConnectionStatusProps {
	status: ConnectionStatusValue;
	hasError: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, hasError }) => {
	const statusConfig = {
	[CONNECTION_STATUS.CONNECTING]: {
			color: "bg-yellow-400",
			text: "Connecting...",
			pulse: true,
	},
	[CONNECTION_STATUS.RECONNECTING]: {
		color: "bg-yellow-400",
		text: "Reconnecting...",
		pulse: true,
	},
	[CONNECTION_STATUS.CONNECTED]: {
			color: "bg-emerald-400",
			text: "Connected",
			pulse: false,
		},
	[CONNECTION_STATUS.DISCONNECTED]: {
			color: "bg-red-400",
			text: "Disconnected",
			pulse: true,
		},
	[CONNECTION_STATUS.ERROR]: {
			color: "bg-red-400",
			text: "Disconnected",
			pulse: true,
		},
	};

	const config = statusConfig[status];

	if (status === CONNECTION_STATUS.CONNECTED && !hasError) {
		return null;
	}

	return (
		<div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 pointer-events-none" role="status" aria-live="polite">
			<div className="flex items-center gap-2 px-3 py-2 glass rounded-full">
				<div aria-hidden="true" className={`w-2 h-2 ${config.color} rounded-full ${config.pulse ? "animate-pulse" : ""}`} />
				<span className="text-xs text-white/80 hidden sm:inline">{config.text}</span>
			</div>
		</div>
	);
};

export default ConnectionStatus;
