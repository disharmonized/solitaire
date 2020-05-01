import { Suit, SpecialRank, Card } from 'src/core';

export function queenOfSpades(): Card {
  return new Card(Suit.SPADES, SpecialRank.QUENN);
}
