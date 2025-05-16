interface CardProps {
  card: string;
}

const Card: React.FC<CardProps> = ({ card }) => {
  if (card === "Hidden") {
    return (
      <div className="p-2 border rounded shadow text-center bg-gray-300 text-gray-500">
        ?
      </div>
    );
  }

  return (
    <div className={"p-2 border rounded shadow text-center bg-white"}>
      {card} {/* Display the card string */}
    </div>
  );
};

export default Card;
