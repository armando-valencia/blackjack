import { useEffect, useState } from "react";
import { CARD_SUITS, HIDDEN_CARD } from "../constants";
import { colors } from "../theme";

interface CardProps {
	card: string;
	index?: number;
}

interface CardValue {
	rank: number | string;
	suit: string;
	suitSymbol: string;
	isRed: boolean;
}

const suitMapper: { [key: string]: { symbol: string; isRed: boolean } } = {
	[CARD_SUITS.HEARTS]: { symbol: "♥", isRed: true },
	[CARD_SUITS.DIAMONDS]: { symbol: "♦", isRed: true },
	[CARD_SUITS.CLUBS]: { symbol: "♣", isRed: false },
	[CARD_SUITS.SPADES]: { symbol: "♠", isRed: false },
};

const getCardValue = (card: string): CardValue => {
	const rankString = card.substring(0, card.length - 1);
	const parsedRank = parseInt(rankString);
	const rank: string | number = isNaN(parsedRank) ? rankString : parsedRank;
	const suitKey = card.charAt(card.length - 1);
	const suitInfo = suitMapper[suitKey];

	return {
		rank: rank,
		suit: suitKey,
		suitSymbol: suitInfo.symbol,
		isRed: suitInfo.isRed,
	};
};

const Card: React.FC<CardProps> = ({ card, index = 0 }) => {
	const [cardValue, setCardValue] = useState<CardValue | null>(null);

	useEffect(() => {
		if (card !== HIDDEN_CARD) setCardValue(getCardValue(card));
	}, [card]);

	const suitColor = cardValue?.isRed ? colors.redSuit : colors.blackSuit;
	const animationDelay = `${index * 100}ms`;

	return card === HIDDEN_CARD ? (
		<div
			className="
				table-card--hidden
				w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40
				rounded-lg
				flex flex-col items-center justify-center
				animate-[flipIn_0.4s_ease-out]
				relative
				overflow-hidden
			"
			style={{ animationDelay }}
		>
			<div className="table-card__pattern absolute inset-0 rounded-lg" />
			<div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-900/50" />
		</div>
	) : (
		<div
			className="
				table-card
				w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40
				rounded-lg
				flex flex-col
				transform hover:scale-105 transition-all duration-300
				animate-[slideIn_0.3s_ease-out]
				relative
				overflow-hidden
			"
			style={{ animationDelay }}
		>
			<div className="table-card__shine absolute inset-0 rounded-lg pointer-events-none" />

			<div className="flex justify-start p-1 md:p-1.5 z-10">
				<div className="flex flex-col items-center leading-none gap-0">
					<span className="text-sm md:text-lg font-bold" style={{ color: suitColor }}>
						{cardValue?.rank}
					</span>
					<span className="text-xs md:text-sm" style={{ color: suitColor }}>
						{cardValue?.suitSymbol}
					</span>
				</div>
			</div>

			<div className="flex justify-center items-center flex-grow z-10">
				<span className="text-2xl md:text-4xl" style={{ color: suitColor }}>
					{cardValue?.suitSymbol}
				</span>
			</div>

			<div className="flex justify-end p-1 md:p-1.5 z-10">
				<div className="flex flex-col items-center rotate-180 leading-none gap-0">
					<span className="text-sm md:text-lg font-bold" style={{ color: suitColor }}>
						{cardValue?.rank}
					</span>
					<span className="text-xs md:text-sm" style={{ color: suitColor }}>
						{cardValue?.suitSymbol}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Card;
