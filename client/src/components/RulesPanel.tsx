import React from "react";
import type { SessionStats } from "../hooks/useSessionStats";

interface RulesPanelProps {
	stats: SessionStats;
	onResetStats: () => void;
}

const RULES = [
	["Scoring", "Number cards count at face value; face cards count as 10; aces count as 1 or 11."],
	["Blackjack", "A two-card 21 is blackjack and beats any other 21."],
	["Dealer", "The dealer reveals the hole card after all players finish and must hit below 17."],
	["Turn order", "Players act one at a time, then the dealer completes the round."],
];

const STAT_ITEMS = [
	["Hands", "handsPlayed"],
	["Wins", "wins"],
	["Losses", "losses"],
	["Pushes", "pushes"],
] as const;

const RulesPanel: React.FC<RulesPanelProps> = ({ stats, onResetStats }) => {
	return (
		<section className="mt-4 bg-table-surface/40 backdrop-blur-xl border border-table-border/30 rounded-2xl overflow-hidden">
			<details>
				<summary className="cursor-pointer list-none px-4 py-3 md:px-5 md:py-4 text-table-text font-medium focus-visible:outline-table-focus">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<span>Rules and session</span>
						<span className="text-table-muted text-sm font-normal">
							{stats.handsPlayed} {stats.handsPlayed === 1 ? "hand" : "hands"} played
						</span>
					</div>
				</summary>

				<div className="border-t border-table-border/30 px-4 py-4 md:px-5 md:py-5">
					<div className="grid gap-5 md:grid-cols-2">
						<div>
							<h2 className="text-table-text font-semibold mb-3">How to play</h2>
							<dl className="space-y-3">
								{RULES.map(([title, description]) => (
									<div key={title}>
										<dt className="text-table-dealer text-sm font-medium">{title}</dt>
										<dd className="text-table-muted text-sm mt-1">{description}</dd>
									</div>
								))}
							</dl>
						</div>

						<div>
							<div className="flex items-center justify-between gap-3 mb-3">
								<h2 className="text-table-text font-semibold">This session</h2>
								<button
									type="button"
									onClick={onResetStats}
									className="text-table-muted hover:text-table-text text-xs underline underline-offset-2"
								>
									Reset
								</button>
							</div>
							<div className="grid grid-cols-2 gap-2">
								{STAT_ITEMS.map(([label, key]) => (
									<div key={label} className="bg-table-surface/60 border border-table-border/30 rounded-lg p-3">
										<p className="text-table-subtle text-xs uppercase tracking-wider">{label}</p>
										<p className="text-table-text text-xl font-semibold mt-1">{stats[key]}</p>
									</div>
								))}
							</div>
							<p className="text-table-subtle text-xs mt-3">Session totals are stored only in this page and reset when you choose Reset or reload.</p>
						</div>
					</div>
				</div>
			</details>
		</section>
	);
};

export default RulesPanel;
