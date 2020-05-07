import { ValidationUtil } from 'src/core/validation/validationUtil';
import { INVALID_CARD_INDEX, INVALID_CARD_INDEXES, INVALID_CARD_NUMBER_TO_TAKE } from 'src/core/errorMessages';

function isPositiveNaturalNumber(value: number): boolean {
  return Number.isInteger(value) && value > -1;
}

function isValidCardIndexCheck(value: number): boolean {
  return value === void 0 || isPositiveNaturalNumber(value);
}

function isValidCardIndexArrayCheck(values: number[]): boolean {
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!isValidCardIndexCheck(value)) {
      return false;
    }
  }
  return true;
}

function isValidCardNumberToTakeCheck(value: number): boolean {
  return isPositiveNaturalNumber(value);
}

export function validCardIndex(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndex(value: number) {
    if (!isValidCardIndexCheck(value)) {
      throw new Error(INVALID_CARD_INDEX(value));
    }
  });
}

export function validCardIndexesRest(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createRestParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndexes(value: number[]) {
    if (!isValidCardIndexArrayCheck(value)) {
      throw new Error(INVALID_CARD_INDEXES(value));
    }
  });
}

export function validCardNumberToTake(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isValidCardNumberToTake(value: number) {
    if (!isValidCardNumberToTakeCheck(value)) {
      throw new Error(INVALID_CARD_NUMBER_TO_TAKE(value));
    }
  });
}
