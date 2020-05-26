import { EMPTY_ARRAY, INVALID_CARD_INDEX, INVALID_CARD_INDEXES, INVALID_CARD_NUMBER_TO_TAKE, NOT_A_NON_NEGATIVE_INTEGER } from 'src/core/errorMessages';
import { ValidationUtil } from 'src/core/validation/validationUtil';

/**
 * Checks if value is non-negative integer.
 * @param {number} value Value to check.
 */
function isNonNegativeIntegerCheck(value: number): boolean {
  return Number.isInteger(value) && value > -1;
}

/**
 * Checks if value is empty array.
 * @param {unknown[]} value Array to check.
 */
function isArrayEmptyCheck(value: unknown[]): boolean {
  return value.length !== 0;
}

/**
 * Checks if value is valid card index.
 * @param {number} value Value to check.
 */
function isValidCardIndexCheck(value: number): boolean {
  return value === void 0 || isNonNegativeIntegerCheck(value);
}

/**
 * Checks if value is valid card index array.
 * @param {number[]} value Array to check.
 */
function isValidCardIndexArrayCheck(values: number[]): boolean {
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (!isValidCardIndexCheck(value)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if value is valid card number to take. Is used for cardstack.take() method or it's derivatives.
 * @param {number} value Value to check.
 */
function isValidCardNumberToTakeCheck(value: number): boolean {
  return isNonNegativeIntegerCheck(value);
}

/**
 * Validator for @validCardIndex parameter decorator.
 * @param {Object} target Class prototype.
 * @param {string} methodName Method name of the class.
 * @param {number} methodParameterIndex Index of the parameter of the method.
 * @throws Error if card index is invalid.
 */
export function validCardIndex(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndex(value: number) {
    if (!isValidCardIndexCheck(value)) {
      throw new Error(INVALID_CARD_INDEX(value));
    }
  });
}

/**
 * Validator for @validCardIndexRest rest parameter decorator.
 * @param {Object} target Class prototype.
 * @param {string} methodName Method name of the class.
 * @param {number} methodParameterIndex Index of the rest parameter of the method.
 * @throws Error if one of the card indexes passed as rest parameter is invalid.
 */
export function validCardIndexesRest(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createRestParameterValidator(target, methodName, methodParameterIndex, function isValidCardIndexes(value: number[]) {
    if (!isValidCardIndexArrayCheck(value)) {
      throw new Error(INVALID_CARD_INDEXES(value));
    }
  });
}

/**
 * Validator for @validCardNumberToTake parameter decorator.
 * @param {Object} target Class prototype.
 * @param {string} methodName Method name of the class.
 * @param {number} methodParameterIndex Index of the parameter of the method.
 * @throws Error if cardNumberToTake parameter value is invalid.
 */
export function validCardNumberToTake(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isValidCardNumberToTake(value: number) {
    if (!isValidCardNumberToTakeCheck(value)) {
      throw new Error(INVALID_CARD_NUMBER_TO_TAKE(value));
    }
  });
}

/**
 * Validator for @nonNegativeInteger parameter decorator.
 * @param {Object} target Class prototype.
 * @param {string} methodName Method name of the class.
 * @param {number} methodParameterIndex Index of the parameter of the method.
 * @throws Error if parameter value is invalid.
 */
export function nonNegativeInteger(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createParameterValidator(target, methodName, methodParameterIndex, function isNonNegativeInteger(value: number) {
    if (!isNonNegativeIntegerCheck(value)) {
      throw new Error(NOT_A_NON_NEGATIVE_INTEGER(value));
    }
  });
}

/**
 * Validator for @notEmptyArrayRest rest parameter decorator.
 * @param {Object} target Class prototype.
 * @param {string} methodName Method name of the class.
 * @param {number} methodParameterIndex Index of the rest parameter of the method.
 * @throws Error if rest parameter value is not empty array.
 */
export function notEmptyArrayRest(target: unknown, methodName: string, methodParameterIndex: number): void {
  ValidationUtil.createRestParameterValidator(target, methodName, methodParameterIndex, function isArrayEmpty(value: number[]) {
    if (!isArrayEmptyCheck(value)) {
      throw new Error(EMPTY_ARRAY());
    }
  });
}
