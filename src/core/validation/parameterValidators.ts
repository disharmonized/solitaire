import { ValidationUtil } from 'src/core/validation/validationUtil';
import { INVALID_CARD_INDEX, INVALID_CARD_INDEXES } from 'src/core/errorMessages';

function isValidCardIndexCheck(index: number): boolean {
  return Number.isInteger(index) && index > -1;
}

function isValidCardIndexArrayCheck(indexes: number[]): boolean {
  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    if (!isValidCardIndexCheck(index)) {
      return false;
    }
  }
  return true;
}

export function cardIndex(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndex(value: number) {
    if (!isValidCardIndexCheck(value)) {
      throw new Error(INVALID_CARD_INDEX(value));
    }
  });
}

export function cardIndexesRest(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createRestParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndexes(value: number[]) {
    if (!isValidCardIndexArrayCheck(value)) {
      throw new Error(INVALID_CARD_INDEXES(value));
    }
  });
}
