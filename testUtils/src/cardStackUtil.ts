import { Card, CardColor, CardStack, Rank, Suit } from 'src/core';
import { parseRank } from 'src/core/util';
import { parseCardColorFromString, SimpleCardColor } from 'testUtils/src/cardUtil';

export function parseCardFromString(stringCard: string): Card {
  if (stringCard.length !== 3) {
    throw new Error(`Invalid stringCard.length ${stringCard.length}: length should be 3`);
  }
  const [stringRank, stringSuit, stringColor] = stringCard.toLowerCase().split('');
  const rank: Rank = parseRank(Number.parseInt(stringRank, 16));
  const suit: Suit = Number.parseInt(stringSuit, 10);
  const color: CardColor = parseCardColorFromString(stringColor);
  if (!(stringSuit in Suit)) {
    throw new Error(`Invalid suit ${stringSuit}: it doesn't exist in Suit type`);
  }
  return new Card(suit, rank, color);
}

export function cardToString(card: Card): string {
  return `${card.rank.toString(16)}${card.suit}${(card.color as SimpleCardColor).toString()}`;
}

export function stringCardsArrayToCardStack(stringCards: string[]): CardStack {
  const cards = [];
  for (const stringCard of stringCards) {
    cards.push(parseCardFromString(stringCard));
  }

  return new CardStack(cards);
}

export function cardsAreEqual(card1: Card | string, card2: Card | string): boolean {
  if (typeof card1 !== 'string') {
    card1 = cardToString(card1);
  }
  if (typeof card2 !== 'string') {
    card2 = cardToString(card2);
  }
  return card1.toLowerCase() === card2.toLowerCase();
}

export function cardStackToStringArray(cardStack: CardStack): string[] {
  const result = [];
  for (const card of cardStack) {
    result.push(cardToString(card));
  }
  return result;
}
