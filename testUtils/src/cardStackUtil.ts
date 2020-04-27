import { CardStack, Card, Suit, Rank } from 'src/core';
import { parseRank } from 'src/core/util';

export function parseCardFromString(stringCard: string): Card {
  if (stringCard.length !== 2) {
    throw new Error(`Invalid stringCard.length ${stringCard.length}: length should be 2`);
  }
  const [stringRank, stringSuit] = stringCard.toLowerCase().split('');
  const rank: Rank = parseRank(Number.parseInt(stringRank, 16));
  const suit: Suit = Number.parseInt(stringSuit, 10);

  if (!(stringSuit in Suit)) {
    throw new Error(`Invalid suit ${stringSuit}: it doesn't exist in Suit type`);
  }
  return new Card(suit, rank);
}

export function cardToString(card: Card): string {
  return `${card.rank.toString(16)}${card.suit}`;
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
