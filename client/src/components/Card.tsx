import { useEffect, useState } from "react";

interface CardProps {
	card: string;
}

interface CardValue {
	rank: number | string;
	suit: string;
}

const cardTemplate =
	"max-w-sm min-w-28 p-3 m-4 rounded-md shadow-md min-h-40 flex flex-col border border-gray-200 font-bold";

const Card: React.FC<CardProps> = ({ card }) => {
	const [cardValue, setCardvalue] = useState<CardValue | null>(null);

	const suitMapper: { [key: string]: string } = {
		H: "♥️",
		D: "♦️",
		C: "♣️",
		S: "♠️",
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getCardValue = (card: string): CardValue => {
		const rankString = card.substring(0, card.length - 1);
		const parsedRank = parseInt(rankString);
		const rank: string | number = isNaN(parsedRank)
			? rankString
			: parsedRank;
		const suit: string = suitMapper[card.charAt(card.length - 1)];

		return {
			rank: rank,
			suit: suit,
		};
	};

	useEffect(() => {
		if (card !== "Hidden") setCardvalue(getCardValue(card));
	}, [card, getCardValue]);

	return card === "Hidden" ? (
		<div className={`${cardTemplate} bg-gray-300`}>
			<div className="flex justify-center items-center flex-grow">?</div>
		</div>
	) : (
		<div className={`${cardTemplate} bg-white`}>
			<div className="flex justify-start">{cardValue?.rank}</div>
			<div className="flex justify-center items-center flex-grow">
				{cardValue?.suit}
			</div>
			<div className="flex justify-end">{cardValue?.rank}</div>
		</div>
	);
};

export default Card;
