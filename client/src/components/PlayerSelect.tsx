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
			<div className="w-full max-w-xl rounded-lg border border-table-border/60 bg-table-surface p-4 sm:p-6">
				<h2 id="player-select-title" className="text-center font-serif text-2xl font-semibold text-table-text">Choose players</h2>
				<p className="mb-5 mt-1 text-center text-sm text-table-muted">Select how many players join the table.</p>

				<ul className="grid grid-cols-2 gap-3 sm:gap-4">
					{playerOptions.map(({ count, label, description }) => (
						<li key={count}>
							<button
								type="button"
								onClick={() => onSelectPlayerCount(count)}
								className="group relative w-full rounded-md border border-table-border/60 bg-table-surface-raised/60 p-4 transition-colors duration-200 hover:border-table-active hover:bg-table-surface-raised sm:p-5"
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
