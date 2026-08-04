import React, { useState, useTransition } from "react";

interface PlayerSelectProps {
	onSelectPlayerCount: (count: number) => void;
	isActionPending: boolean;
}

const PlayerSelect: React.FC<PlayerSelectProps> = ({ onSelectPlayerCount, isActionPending }) => {
	const [selectedPlayerCount, setSelectedPlayerCount] = useState<number | null>(null);
	const [isTransitionPending, startTransition] = useTransition();
	const isSelecting = isTransitionPending || isActionPending;
	const playerOptions = [
		{ count: 1, label: "Just You", description: "Solo vs Dealer" },
		{ count: 2, label: "2 Players", description: "You + 1 Bot" },
		{ count: 3, label: "3 Players", description: "You + 2 Bots" },
		{ count: 4, label: "4 Players", description: "You + 3 Bots" },
	];

	const handlePlayerCountSelect = (count: number) => {
		if (isSelecting) return;

		startTransition(() => setSelectedPlayerCount(count));
		onSelectPlayerCount(count);
	};

	return (
		<section aria-labelledby="player-select-title" className="flex justify-center">
			<div className="w-full max-w-xl rounded-lg border border-table-border/60 bg-table-surface p-4 sm:p-6">
				<h2 id="player-select-title" className="text-center font-serif text-2xl font-semibold text-table-text">Choose players</h2>
				<p className="mb-5 mt-1 text-center text-sm text-table-muted" aria-live="polite">
					{isSelecting ? "Setting up the table..." : "Select how many players join the table."}
				</p>

				<ul className="grid grid-cols-2 gap-3 sm:gap-4">
					{playerOptions.map(({ count, label, description }) => (
						<li key={count}>
							<button
								type="button"
								onClick={() => handlePlayerCountSelect(count)}
								disabled={isSelecting}
								aria-busy={selectedPlayerCount === count && isActionPending}
								aria-pressed={selectedPlayerCount === count}
								className={`w-full rounded-md border p-4 transition-colors duration-200 hover:border-table-active hover:bg-table-surface-raised disabled:cursor-wait disabled:opacity-60 sm:p-5 ${selectedPlayerCount === count ? "border-table-active bg-table-surface-raised" : "border-table-border/60 bg-table-surface-raised/60"}`}
							>
								<span className="block text-center">
									<span className="mb-1 block text-xl font-bold text-white sm:text-3xl">
										{selectedPlayerCount === count && isActionPending ? "Setting up..." : label}
									</span>
									<span className="text-table-muted block text-xs">{description}</span>
								</span>
							</button>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default PlayerSelect;
