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
		<section aria-labelledby="player-select-title" className="flex justify-center">
			<div className="bg-table-surface/60 backdrop-blur-2xl border border-table-border/30 px-4 py-6 sm:px-8 sm:py-10 rounded-2xl max-w-xl w-full">
				<h2 id="player-select-title" className="text-white text-2xl font-bold text-center mb-2">Choose Players</h2>
				<p className="text-table-muted text-center mb-8 text-sm">Select how many players vs the Dealer</p>

				<ul className="grid grid-cols-2 gap-3 sm:gap-4">
					{playerOptions.map(({ count, label, description }) => (
						<li key={count}>
							<button
								type="button"
								onClick={() => onSelectPlayerCount(count)}
								className="group relative w-full bg-table-surface-raised/50 hover:bg-slate-700/50 border-2 border-table-border/50 hover:border-emerald-500/50 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:scale-105"
							>
								<span className="block text-center">
									<span className="block text-xl sm:text-3xl font-bold text-white mb-1">{label}</span>
									<span className="block text-table-muted text-xs">{description}</span>
								</span>
								<span aria-hidden="true" className="absolute inset-0 rounded-xl bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-200" />
							</button>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default PlayerSelect;
