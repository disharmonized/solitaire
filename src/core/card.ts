import { Suit, Rank } from 'src/core';

/**
 * Card class
 */
export class Card {
  /**
   * Card constructor
   * @param {*} suit
   * @param {*} rank From 1 to 13 (1 - Ace, 11 - Jack, 12 - Quenn, 13 - King)
   * @param {*} isFacedUp Whether card is faced up or not
   */
  constructor(private _suit: Suit, private _rank: Rank, private _isFacedUp = false) {}

  get isFacedUp(): boolean {
    return this._isFacedUp;
  }

  get rank(): Rank {
    return this._rank;
  }

  get suit(): Suit {
    return this._suit;
  }

  /**
   * Roll card
   */
  roll(): void {
    this._isFacedUp = !this.isFacedUp;
  }
}
