import React from "react";
import Card from "./Card";

interface HandProps {
	cards: string[];
	score: number;
	label: string;
}

const Hand: React.FC<HandProps> = ({ cards, score, label }) => (
	<div className="mb-4">
		<h2 className="text-xl font-semibold">
			{label} ({score})
		</h2>
		<div className="flex justify-center space-x-2 mt-2">
			{cards.map((cardString, index) => (
				<Card key={index} card={cardString} />
			))}
		</div>
	</div>
);

export default Hand;
