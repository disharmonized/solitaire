import { Suit, SpecialRank, Card } from '../../../src/core';

export function createQueenOfSpades(): Card {
  return new Card(Suit.SPADES, SpecialRank.QUENN);
}
