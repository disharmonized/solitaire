import { RankValueBounds } from 'src/core';
import { ParameterType } from 'src/core/validation/validationUtil';

export function INVALID_CARD_INDEX(value: number): string {
  return `Invalid card index ${value}: should be non-negative integer`;
}

export function INVALID_CARD_INDEXES(value: number[]): string {
  return `Invalid card indexes ${value.join(', ')}: all should be non-negative integers`;
}

export function EMPTY_ARRAY(): string {
  return `Invalid value: array is empty`;
}

export function UNKNOWN_PARAMETER_TYPE(value: ParameterType): string {
  return `Unknown parameter type ${value}`;
}

export function CARD_INDEX_DOESNT_EXIST(value: number, cardStackAlias: string): string {
  return `Card with index ${value} doesn't exist in card stack ${cardStackAlias}`;
}

export function INVALID_RANK_VALUE(value: number): string {
  return `Invalid rank value ${value}: should be >= ${RankValueBounds.START_VALUE} and <= ${RankValueBounds.END_VALUE}`;
}

export function MISSING_CARD_INDEX(cardStackAlias: string): string {
  return `Cannot add card stack into stack ${cardStackAlias}: card index is missing`;
}

export function CARD_INDEX_SHOULD_BE_OMITTED(cardStackAlias: string): string {
  return `Cannot add card stack into stack ${cardStackAlias}: target stack is empty so no card index should be passed`;
}

export function INVALID_CARD_NUMBER_TO_TAKE(value: number): string {
  return `Invalid card number to take ${value}: should be non-negative integer`;
}

export function CANNOT_TAKE_CARDS_CARDSTACK_IS_EMPTY(cardStackAlias: string): string {
  return `Cannot take cards from card stack ${cardStackAlias}: stack is empty`;
}

export function CANNOT_TAKE_CARDS_NOT_ENOUGH_CARDS(value: number, availableCardsCount: number, cardStackAlias: string): string {
  return `Cannot take ${value} cards from card stack ${cardStackAlias}: only ${availableCardsCount} cards are available to take`;
}

export function RANGE_START_VALUE_IS_GREATER_THEN_END_VALUE(start: number, end: number): string {
  return `Cannot create range: start value ${start} is greater than end value ${end}`;
}

export function RANGE_START_VALUE_EQUALS_END_VALUE(start: number): string {
  return `Cannot create range: start value ${start} equals end value`;
}

export function NOT_A_NON_NEGATIVE_INTEGER(value: number): string {
  return `Invalid value ${value}: should be non-negative integer`;
}

export function CANNOT_TURN_AROUND_CARDS_IN_EMPTY_CARDSTACK(): string {
  return 'Cannot turn around cards in empty card stack';
}

export function TURN_AROUND_INDEXES_NOT_FOUND(indexes: number[]): string {
  return `Cannot turn around cards: indexes ${indexes.join(',')} don't exist in card stack`;
}

export function TURN_TOP_CARDS_AROUND_NUMBER_OF_CARDS_EXCEEDS_CARDS_COUNT(value: number, cardCount: number): string {
  return `Cannot turn top cards around: number of cards ${value} exceeds number of cards ${cardCount} in the stack`;
}

export function TURN_START_INDEX_VALUE_IS_GREATER_OR_EQUALS_END_INDEX_VALUE(start: number, end: number): string {
  return `Cannot turn around cards: start card index value ${start} is greater or equals end card index value ${end}`;
}
