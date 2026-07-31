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
	suitName: string;
	suitSymbol: string;
	isRed: boolean;
}

const suitMapper: { [key: string]: { name: string; symbol: string; isRed: boolean } } = {
	[CARD_SUITS.HEARTS]: { name: "hearts", symbol: "♥", isRed: true },
	[CARD_SUITS.DIAMONDS]: { name: "diamonds", symbol: "♦", isRed: true },
	[CARD_SUITS.CLUBS]: { name: "clubs", symbol: "♣", isRed: false },
	[CARD_SUITS.SPADES]: { name: "spades", symbol: "♠", isRed: false },
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
		suitName: suitInfo.name,
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
			role="img"
			aria-label={isDealerHoleCard ? "Dealer hole card hidden" : "Hidden card"}
			className={`
				shrink-0 w-[clamp(3.75rem,16vw,5.5rem)] h-[clamp(5.5rem,24vw,7.75rem)] md:w-24 md:h-36
				rounded-lg
				flex flex-col items-center justify-center
				bg-table-surface-raised
				shadow-sm
				border-2 border-table-border/50
				animate-[flipIn_0.4s_ease-out]
				relative
				overflow-hidden
			`}
			style={animationStyle}
		>
			<div aria-hidden="true" className="absolute inset-[3px] rounded-md border border-white/10" />
		</div>
	) : (
		<div
			role="img"
			aria-label={`${cardValue?.rank} of ${cardValue?.suitName}`}
			className={`
				shrink-0 w-[clamp(4rem,18vw,5rem)] h-[clamp(6rem,27vw,7rem)] md:w-28 md:h-40
				rounded-lg
				flex flex-col
				bg-[#fffdf5]
				shadow-sm
				border-2 border-[#d6c9aa]
				transition-shadow duration-200 hover:shadow-md
				${isDealerHoleCard ? "animate-[flipIn_0.4s_ease-out]" : "animate-[slideIn_0.3s_ease-out]"}
				relative
				overflow-hidden
			`}
			style={animationStyle}
		>
			<div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

			<div className="flex justify-start p-1 md:p-1.5 z-10">
				<div className="flex flex-col items-center leading-none gap-0">
					<span className="text-xs sm:text-sm md:text-lg font-bold" style={{ color: suitColor }}>
						{cardValue?.rank}
					</span>
					<span className="text-[0.65rem] sm:text-xs md:text-sm" style={{ color: suitColor }}>
						{cardValue?.suitSymbol}
					</span>
				</div>
			</div>

			<div className="flex justify-center items-center flex-grow z-10">
				<span className="text-xl sm:text-2xl md:text-4xl" style={{ color: suitColor }}>
					{cardValue?.suitSymbol}
				</span>
			</div>

			<div className="flex justify-end p-1 md:p-1.5 z-10">
				<div className="flex flex-col items-center rotate-180 leading-none gap-0">
					<span className="text-xs sm:text-sm md:text-lg font-bold" style={{ color: suitColor }}>
						{cardValue?.rank}
					</span>
					<span className="text-[0.65rem] sm:text-xs md:text-sm" style={{ color: suitColor }}>
						{cardValue?.suitSymbol}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Card;
