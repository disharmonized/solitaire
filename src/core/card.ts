import { Suit } from 'core';

/**
 * Card class
 */
export class Card {
  private _isFacedUp: boolean;
  private _rank: number;
  private _suit: Suit;

  /**
   * Card constructor
   * @param {*} suit
   * @param {*} rank From 1 to 13 (1 - Ace, 11 - Jack, 12 - Quenn, 13 - King)
   * @param {*} isFacedUp Whether card is faced up or not
   */
  constructor(suit: Suit, rank: number, isFacedUp = false) {
    this._suit = suit;
    //todo validate
    this._rank = rank;
    this._isFacedUp = isFacedUp;
  }

  get isFacedUp(): boolean {
    return this._isFacedUp;
  }

  get rank(): number {
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
