/**
 * Represents enum of special card ranks.
 */
export const enum SpecialRank {
  JOKER = 0,
  ACE = 1,
  JACK = 11, // b
  QUENN = 12, // c
  KING = 13, // d
}

/**
 * Represents standard acrd ranks.
 */
export const StandardRanks: ReadonlyArray<number> = [SpecialRank.ACE, 2, 3, 4, 5, 6, 7, 8, 9, 10, SpecialRank.JACK, SpecialRank.QUENN, SpecialRank.KING];

/**
 * Represents standard card suits.
 */
export enum StandardSuit {
  /**
   * ♦
   */
  DIAMONDS = 0,
  /**
   * ♣
   */
  CLUBS = 1,
  /**
   * ♥
   */
  HEARTS = 2,
  /**
   * ♠
   */
  SPADES = 3,
}
