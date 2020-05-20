export { Card } from 'src/core/card';
export { CardStack } from 'src/core/cardStack';
export * from 'src/core/errorMessages';

import { CardStack } from 'src/core/cardStack';

export enum Suit {
  DIAMONDS = 0, // ♦
  CLUBS = 1, // ♣
  HEARTS = 2, // ♥
  SPADES = 3, // ♠
}

export const enum SpecialRank {
  ACE = 1,
  JACK = 11, // b
  QUENN = 12, // c
  KING = 13, //d
}

export const enum RankValueBounds {
  START_VALUE = 1,
  END_VALUE = 13,
}

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

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

export interface CardColor {
  name?: string;
  code?: string;
}
