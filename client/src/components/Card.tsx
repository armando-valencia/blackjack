import { useEffect, useState } from "react";

interface CardProps {
  card: string;
}

interface CardValue {
  rank: number | string;
  suit: string;
}

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
    const rank: string | number = isNaN(parsedRank) ? rankString : parsedRank;
    const suit: string = suitMapper[card.charAt(card.length - 1)];

    return {
      rank: rank,
      suit: suit,
    };
  };

  useEffect(() => {
    if (card !== "Hidden") setCardvalue(getCardValue(card));
  }, [card, getCardValue]);

  if (card === "Hidden") {
    return (
      <div className="p-2 border rounded shadow text-center bg-gray-300 text-gray-500">
        ?
      </div>
    );
  }

  //    card item with
  return (
    <>
      {/* <div className={"p-2 border rounded shadow text-center bg-white"}>
        <div className="flex row"></div>
        {cardValue?.rank}
        {cardValue?.suit}
      </div> */}
      <div className="grid grid-cols-5 grid-rows-5 gap-4 p-2 border rounded shadow text-center bg-white w-fit">
        <div>{cardValue?.rank}</div>
        <div></div>
        <div></div>
        <div className="row-start-2"></div>
        <div className="row-start-2"></div>
        <div className="row-start-2"></div>
        <div className="row-start-3"></div>
        <div className="row-start-3">{cardValue?.suit}</div>
        <div className="row-start-3"></div>
        <div className="row-start-4"></div>
        <div className="row-start-4"></div>
        <div className="row-start-4"></div>
        <div className="row-start-5"></div>
        <div className="row-start-5"></div>
        <div className="row-start-5">{cardValue?.rank}</div>
      </div>
    </>
  );
};

export default Card;
