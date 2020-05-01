import { ParameterType } from 'src/core/validation/validationUtil';
import { RankValueBounds } from 'src/core';

export function INVALID_CARD_INDEX(value: number): string {
  return `Invalid card index ${value}: should be non-negative integer`;
}

export function INVALID_CARD_INDEXES(value: number[]): string {
  return `Invalid card indexes ${value.join(', ')}: all should be non-negative integers`;
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

export function CARD_STACK_IS_EMPTY(cardStackAlias: string): string {
  return `Cannot put cards into stack ${cardStackAlias}: stack is empty`;
}

export function MISSING_CARD_INDEX(cardStackAlias: string): string {
  return `Cannot put cards into stack ${cardStackAlias}: card index is missing`;
}

export function CARD_INDEX_SHOULD_BE_OMITTED(cardStackAlias: string): string {
  return `Cannot put cards into stack ${cardStackAlias}: target stack is empty so no card index should be passed`;
}
