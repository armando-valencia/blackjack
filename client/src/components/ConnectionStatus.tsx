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
				color: "bg-table-focus",
			text: "Connecting...",
			pulse: true,
	},
	[CONNECTION_STATUS.RECONNECTING]: {
		color: "bg-table-focus",
		text: "Reconnecting...",
		pulse: true,
	},
	[CONNECTION_STATUS.CONNECTED]: {
			color: "bg-table-active",
			text: "Connected",
			pulse: false,
		},
	[CONNECTION_STATUS.DISCONNECTED]: {
			color: "bg-table-loss",
			text: "Disconnected",
			pulse: true,
		},
	[CONNECTION_STATUS.ERROR]: {
		color: "bg-table-loss",
			text: "Disconnected",
			pulse: true,
		},
	};

	const config = statusConfig[status];

	if (status === CONNECTION_STATUS.CONNECTED && !hasError) {
		return null;
	}

	return (
		<div className="pointer-events-none absolute right-3 top-3 z-50 sm:right-4 sm:top-4" role="status" aria-live="polite">
			<div className="flex items-center gap-2 rounded-md border border-table-border/60 bg-table-surface px-3 py-2 shadow-sm">
				<div aria-hidden="true" className={`w-2 h-2 ${config.color} rounded-full ${config.pulse ? "animate-pulse" : ""}`} />
				<span className="hidden text-xs text-table-muted sm:inline">{config.text}</span>
			</div>
		</div>
	);
};

export default ConnectionStatus;
