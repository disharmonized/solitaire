import { CardColor, Rank, Suit } from 'src/core';

/**
 * Card class
 */
export class Card {
  /**
   * Card constructor
   * @param {Suit} suit Suit of the card
   * @param {Rank} rank Rank of the card
   * @param {CardColor} color Color of the card
   * @param {boolean} isFacedUp Whether card is faced up or not
   */
  constructor(private _suit: Suit, private _rank: Rank, private _color: CardColor, private _isFacedUp = false) {}

  get isFacedUp(): boolean {
    return this._isFacedUp;
  }

  get rank(): Rank {
    return this._rank;
  }

  get suit(): Suit {
    return this._suit;
  }

  get color(): CardColor {
    return this._color;
  }

  /**
   * Roll card
   */
  roll(): void {
    this._isFacedUp = !this.isFacedUp;
  }
}
