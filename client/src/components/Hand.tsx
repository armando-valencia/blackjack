import React from "react";
import Card from "./Card";

interface HandProps {
	cards: string[];
	score: number;
	label: string;
}

const Hand: React.FC<HandProps> = ({ cards, score, label }) => (
	<div className="mb-6 md:mb-8">
		<div className="flex items-center justify-center gap-3 mb-4">
			<h2 className="text-lg md:text-xl font-semibold text-slate-300 tracking-wide">
				{label}
			</h2>
			<div className="
				px-3 py-1
				bg-slate-800/80
				border border-slate-600/50
				rounded-md
				shadow-sm
			">
				<span className="text-base md:text-lg font-bold text-white">{score}</span>
			</div>
		</div>
		<div className="flex justify-center gap-2 md:gap-4 perspective-1000">
			{cards.map((cardString, index) => (
				<Card key={`${cardString}-${index}`} card={cardString} index={index} />
			))}
		</div>
	</div>
);

export default Hand;
