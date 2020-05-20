import { Card, CardColor, SpecialRank, Suit } from 'src/core';

export class SimpleCardColor implements CardColor {
  constructor(public name?: string, public code?: string) {}
  toString(): string {
    return this.code;
  }
}

export class SimpleCardColors {
  static Black = new SimpleCardColor('black', '0');
  static Red = new SimpleCardColor('red', '1');
  static Blue = new SimpleCardColor('blue', '2');
  static Green = new SimpleCardColor('green', '3');
}

export function parseCardColorFromString(value: string): SimpleCardColor {
  if (value.length !== 1) {
    throw new Error(`Cannot parse card color ${value} from string: length should be 1`);
  }
  switch (value) {
    case '0': {
      return SimpleCardColors.Black;
    }
    case '1': {
      return SimpleCardColors.Red;
    }
    case '2': {
      return SimpleCardColors.Blue;
    }
    case '3': {
      return SimpleCardColors.Green;
    }
    default:
      throw new Error(`Cannot parse card color ${value} from string: Unknown color code`);
  }
}

export function blackQueenOfSpades(): Card {
  return new Card(Suit.SPADES, SpecialRank.QUENN, SimpleCardColors.Black);
}
