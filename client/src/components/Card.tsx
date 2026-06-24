import { useEffect, useState } from "react";
import { CARD_SUITS, HIDDEN_CARD } from "../constants";
import { colors } from "../theme";

interface CardProps {
	card: string;
	index?: number;
	isDealerHoleCard?: boolean;
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

const Card: React.FC<CardProps> = ({ card, index = 0, isDealerHoleCard = false }) => {
	const [cardValue, setCardValue] = useState<CardValue | null>(null);

	useEffect(() => {
		if (card !== HIDDEN_CARD) setCardValue(getCardValue(card));
	}, [card]);

	const suitColor = cardValue?.isRed ? colors.redSuit : colors.blackSuit;
	const animationDelay = `${Math.min(index, 4) * 80}ms`;
	const animationStyle = { animationDelay, animationFillMode: "both" };

	return card === HIDDEN_CARD ? (
		<div
			className={`
				w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40
				rounded-lg
				flex flex-col items-center justify-center
				bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900
				shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
				border-2 border-table-border/50
				animate-[flipIn_0.4s_ease-out]
				relative
				overflow-hidden
			`}
			style={animationStyle}
		>
			<div className="absolute inset-0 rounded-lg bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_20px)]" />
			<div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-900/50" />
		</div>
	) : (
		<div
			className={`
				w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40
				rounded-lg
				flex flex-col
				bg-gradient-to-br from-white via-gray-50 to-gray-100
				shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6),0_2px_8px_-2px_rgba(0,0,0,0.3)]
				border-2 border-gray-200
				transform hover:scale-105 transition-all duration-300
				${isDealerHoleCard ? "animate-[flipIn_0.4s_ease-out]" : "animate-[slideIn_0.3s_ease-out]"}
				relative
				overflow-hidden
			`}
			style={animationStyle}
		>
			<div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

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
