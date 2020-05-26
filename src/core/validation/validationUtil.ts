import 'reflect-metadata';

/**
 * Interface for method validation metadata key.
 */
export interface MethodValidationMetadataKey {
  method: string;
  parameterIndex: number;
  parameterType: ParameterType;
  validatorFunctionName: string;
}

/**
 * Interface for method validation metadata info.
 */
export interface MethodValidationMetadataInfo {
  validatee: MethodValidationMetadataKey;
  validator: Function;
}
/**
 * Enum for parameter type.
 */
export enum ParameterType {
  Ordinary,
  Rest,
}

/**
 * Helper class that manipulates with metadata for the @validate decorator.
 */
export class ValidationUtil {
  /**
   * String prefix for metadata.
   */
  static keyPrefix = '_validation';

  /**
   * String separator for metadata key.
   */
  static keySeparator = '|';

  /**
   * Sets metadata for the @validate decorator.
   * @param {Object} target Class prototype.
   * @param {MethodValidationMetadataKey} metadataKey metadata key.
   * @param {Function} validator validator function that validates the parameter value.
   */
  static setMethodValidationMetadata(target: unknown, metadataKey: MethodValidationMetadataKey, validator: Function): void {
    const keyToSave = [
      this.keyPrefix,
      metadataKey.method,
      metadataKey.parameterType.toString(),
      metadataKey.parameterIndex,
      metadataKey.validatorFunctionName,
    ].join(this.keySeparator);
    Reflect.defineMetadata(keyToSave, validator, target as object);
  }

  /**
   * Gets metadata for the @validate decorator.
   * @param {Object} target Class prototype.
   * @returns {MethodValidationMetadataInfo[]} Method validation metadata info array.
   */
  static getMethodValidationMetadata(target: unknown): MethodValidationMetadataInfo[] {
    const metadataList: MethodValidationMetadataInfo[] = [];
    const metadataKeys: string[] = Reflect.getOwnMetadataKeys(target);
    metadataKeys.forEach(key => {
      if (key.startsWith(this.keyPrefix)) {
        const keyValues = key.split(this.keySeparator);
        keyValues.shift(); // removes keyPrefix.
        const [method, parameterTypeStringified, parameterIndexStringified, validatorFunctionName] = keyValues;
        const parameterIndex = Number.parseInt(parameterIndexStringified, 10);
        const parameterTypeAsInt = Number.parseInt(parameterTypeStringified, 10);
        const parameterType: ParameterType = parameterTypeAsInt as ParameterType;
        const validatee = { method, parameterIndex, parameterType, validatorFunctionName };
        const validator: Function = Reflect.getMetadata(key, target);
        metadataList.push({ validatee, validator });
      }
    });
    return metadataList;
  }

  /**
   * Creates parameter validator.
   * @param {Object} target Class prototype.
   * @param {string} methodName Method name of the class.
   * @param {number} methodParameterIndex Index of the parameter of the method.
   * @param {Function} validatorFunction validator function.
   */
  static createParameterValidator(target: unknown, methodName: string, methodParameterIndex: number, validatorFunction: Function): void {
    const metadata: MethodValidationMetadataKey = {
      method: methodName,
      parameterIndex: methodParameterIndex,
      validatorFunctionName: validatorFunction.name,
      parameterType: ParameterType.Ordinary,
    };
    ValidationUtil.setMethodValidationMetadata(target, metadata, validatorFunction);
  }

  /**
   * Creates rest parameter validator.
   * @param {Object} target Class prototype.
   * @param {string} methodName Method name of the class.
   * @param {number} methodParameterIndex Index of the rest parameter of the method.
   * @param {Function} validatorFunction validator function.
   */
  static createRestParameterValidator(target: unknown, methodName: string, methodParameterIndex: number, validatorFunction: Function): void {
    const metadata: MethodValidationMetadataKey = {
      method: methodName,
      parameterIndex: methodParameterIndex,
      validatorFunctionName: validatorFunction.name,
      parameterType: ParameterType.Rest,
    };
    ValidationUtil.setMethodValidationMetadata(target, metadata, validatorFunction);
  }
}
