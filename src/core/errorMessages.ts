import { ParameterType } from './validation/validationUtil';

export function INVALID_CARD_INDEX(value: number): string {
  return `Invalid card index ${value}: should be non-negative integer`;
}

export function INVALID_CARD_INDEXES(value: number[]): string {
  return `Invalid card indexes ${value.join(', ')}: all should be non-negative integers`;
}

export function UNKNOWN_PARAMETER_TYPE(value: ParameterType): string {
  return `Unknown parameter type ${value}`;
}
