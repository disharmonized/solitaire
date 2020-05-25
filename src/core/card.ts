import { CardColor, CardRank, CardSuit } from 'src/core';

/**
 * Card class
 */
export class Card {
  /**
   * Card constructor
   * @param {CardSuit} suit Suit of the card
   * @param {CardRank} rank Rank of the card
   * @param {CardColor} color Color of the card
   * @param {boolean} isFacedUp Whether card is faced up or not
   */
  constructor(private _suit: number | CardSuit, private _rank: number | CardRank, private _color: CardColor, private _isFacedUp = false) {}

  get isFacedUp(): boolean {
    return this._isFacedUp;
  }

  get rank(): number | CardRank {
    return this._rank;
  }

  get suit(): number | CardSuit {
    return this._suit;
  }

  get color(): CardColor {
    return this._color;
  }

  /**
   * Turns around card
   */
  turnAround(): void {
    this._isFacedUp = !this.isFacedUp;
  }
}
