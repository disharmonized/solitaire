export { Card } from './card';
export { CardStack } from './cardStack';
export * from './errors';

import { CardStack } from './cardStack';

export enum Suit {
  DIAMONDS, // ♦
  CLUBS, // ♣
  HEARTS, // ♥
  SPADES, // ♠
}

export enum SpecialRank {
  ACE = 1,
  JACK = 11,
  QUENN = 12,
  KING = 13,
}
export type SimpleRank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Rank = SimpleRank | SpecialRank;

export interface MoveCardFromCardStack {
  index: number;
  destStack: CardStack;
  destIndex?: number;
}

export interface MoveCardsFromCardStack {
  indexStart: number;
  indexEnd?: number;
  destStack: CardStack;
  destIndex?: number;
}
