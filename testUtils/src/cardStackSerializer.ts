import { Card, CardColor, CardStack } from 'src/core';
import { StandardRanks, StandardSuit } from 'src/core/standard';
import { parseCardColorFromString, SimpleCardColor } from 'testUtils/src/cardUtil';

export interface Options {
  isFacedUpIncluded?: boolean;
}
export class CardStackSerializer {
  constructor(private options: Options) {
    if (options.isFacedUpIncluded === void 0) {
      this.options.isFacedUpIncluded = false;
    }
  }
  parseCardFromString(stringCard: string): Card {
    // 4th code is for IsFacedUp value and is optional
    // it's made intentionally to not make tests that are not require this field simplier to read
    const expectedLength = this.options.isFacedUpIncluded ? 4 : 3;
    if (stringCard.length !== expectedLength) {
      throw new Error(`Invalid stringCard.length ${stringCard.length}: length should be ${expectedLength}`);
    }
    const [stringRank, stringSuit, stringColor, stringIsFacedUp] = stringCard.toLowerCase().split('');
    const rank: number = this.parseRank(Number.parseInt(stringRank, 16));
    const suit: number = Number.parseInt(stringSuit, 10);
    if (!(stringSuit in StandardSuit)) {
      throw new Error(`Invalid suit ${stringSuit}: it doesn't exist in StandardSuit type`);
    }
    const color: CardColor = parseCardColorFromString(stringColor);
    let isFacedUp;
    if (this.options.isFacedUpIncluded) {
      isFacedUp = this.parseIsFacedUp(stringIsFacedUp);
    }

    return new Card(suit, rank, color, isFacedUp);
  }

  isFacedUpToString(isFacedUp: boolean): string {
    return isFacedUp ? '+' : '-';
  }
  parseIsFacedUp(stringIsFacedUp: string): boolean {
    if (stringIsFacedUp === '+') {
      return true;
    } else if (stringIsFacedUp === '-') {
      return false;
    } else {
      throw new Error(`Cannot parse isFacedUp value ${stringIsFacedUp}: should be either + or -`);
    }
  }

  cardToString(card: Card): string {
    let value = `${card.rank.toString(16)}${card.suit}${(card.color as SimpleCardColor).toString()}`;
    if (this.options.isFacedUpIncluded) {
      value = `${value}${this.isFacedUpToString(card.isFacedUp)}`;
    }
    return value;
  }

  stringCardsArrayToCardStack(stringCards: string[]): CardStack {
    const cards = [];
    for (const stringCard of stringCards) {
      cards.push(this.parseCardFromString(stringCard));
    }

    return new CardStack(cards);
  }

  cardsAreEqual(card1: Card | string, card2: Card | string): boolean {
    if (typeof card1 !== 'string') {
      card1 = this.cardToString(card1);
    }
    if (typeof card2 !== 'string') {
      card2 = this.cardToString(card2);
    }
    return card1.toLowerCase() === card2.toLowerCase();
  }

  cardStackToStringArray(cardStack: CardStack): string[] {
    const result = [];
    for (const card of cardStack) {
      result.push(this.cardToString(card));
    }
    return result;
  }

  parseRank(value: number): number {
    if (StandardRanks.includes(value)) {
      return value;
    }
    throw new Error(`Invalid rank value ${value}: should be one of [${StandardRanks.join(',')}]`);
  }
}
