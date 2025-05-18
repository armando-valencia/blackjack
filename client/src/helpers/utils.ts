// const getCardValue = (card: string): CardValue => {
//   // Basic validation for card string length
//   if (card.length < 2) {
//     console.error("Invalid card format:", card);
//     return { rank: "Invalid", suit: undefined }; // Or handle invalid format as appropriate
//   }

//   // The rank is the substring from the beginning up to the second-to-last character
//   const rankString = card.substring(0, card.length - 1);

//   // The suit character is the last character
//   const suitChar = card.charAt(card.length - 1);

//   // Determine the rank: try parsing as number, otherwise keep as string
//   const parsedRank = parseInt(rankString);
//   const rank: string | number = isNaN(parsedRank) ? rankString : parsedRank;

//   // Map the suit character to a Suit type
//   const suit: Suit | undefined = suitMapper[suitChar];

//   return {
//     rank: rank,
//     suit: suit,
//   };
// };

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};
