import { ValidationUtil } from 'core/validation/validationUtil';
import { INVALID_CARD_INDEX } from 'core/errorMessages';

function isValidCardIndexCheck(index: number): boolean {
  return Number.isInteger(index) && index > -1;
}

export function cardIndex(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndex(value) {
    if (!isValidCardIndexCheck(value)) {
      throw new Error(INVALID_CARD_INDEX(value));
    }
  });
}
