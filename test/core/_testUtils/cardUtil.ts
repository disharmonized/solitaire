import { Suit, SpecialRank, Card } from 'core';

export function createQueenOfSpades(): Card {
  return new Card(Suit.SPADES, SpecialRank.QUENN);
}
