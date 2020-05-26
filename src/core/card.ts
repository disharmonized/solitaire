import { CardColor, CardRank, CardSuit } from 'src/core';

/**
 * Represents card.
 */
export class Card {
  /**
   * Creates card.
   * @param {CardSuit} suit Suit of the card.
   * @param {CardRank} rank Rank of the card.
   * @param {CardColor} color Color of the card.
   * @param {boolean} isFacedUp Whether card is faced up or not.
   */
  constructor(private _suit: number | CardSuit, private _rank: number | CardRank, private _color: CardColor, private _isFacedUp = false) {}

  /**
   * @returns {boolean} Whether card is faced up or not.
   */
  get isFacedUp(): boolean {
    return this._isFacedUp;
  }

  /**
   * @returns {number | CardRank} Rank of the card.
   */
  get rank(): number | CardRank {
    return this._rank;
  }

  /**
   * @returns {number | CardSuit} Suit of the card.
   */
  get suit(): number | CardSuit {
    return this._suit;
  }

  /**
   * @returns {CardColor} Color of the card.
   */
  get color(): CardColor {
    return this._color;
  }

  /**
   * Turns around card.
   */
  turnAround(): void {
    this._isFacedUp = !this.isFacedUp;
  }
}
