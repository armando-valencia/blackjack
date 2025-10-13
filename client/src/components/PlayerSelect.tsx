import React from "react";

interface PlayerSelectProps {
	onSelectPlayerCount: (count: number) => void;
}

const PlayerSelect: React.FC<PlayerSelectProps> = ({ onSelectPlayerCount }) => {
	const playerOptions = [
		{ count: 1, label: "Just You", description: "Solo vs Dealer" },
		{ count: 2, label: "2 Players", description: "You + 1 Bot" },
		{ count: 3, label: "3 Players", description: "You + 2 Bots" },
		{ count: 4, label: "4 Players", description: "You + 3 Bots" },
	];

	return (
		<div className="flex justify-center">
			<div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/30 px-8 py-10 rounded-2xl max-w-xl w-full">
				<h2 className="text-white text-2xl font-bold text-center mb-2">Choose Players</h2>
				<p className="text-slate-400 text-center mb-8 text-sm">Select how many players vs the Dealer</p>

				<div className="grid grid-cols-2 gap-4">
					{playerOptions.map(({ count, label, description }) => (
						<button
							key={count}
							onClick={() => onSelectPlayerCount(count)}
							className="group relative bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600/50 hover:border-emerald-500/50 rounded-xl p-6 transition-all duration-200 hover:scale-105"
						>
							<div className="text-center">
								<div className="text-3xl font-bold text-white mb-1">{label}</div>
								<div className="text-slate-400 text-xs">{description}</div>
							</div>
							<div className="absolute inset-0 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-200" />
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default PlayerSelect;
