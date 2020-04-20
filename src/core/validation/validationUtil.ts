import 'reflect-metadata';

export interface MethodValidationMetadataKey {
  method: string;
  argumentIndex: number;
  validatorFunctionName: string;
}

export interface MethodValidationMetadataInfo {
  validatee: MethodValidationMetadataKey;
  validator: Function;
}

export class ValidationUtil {
  static keyPrefix = '_validation';
  static keySeparator = '-';

  static setMethodValidationMetadata(target: unknown, metadata: MethodValidationMetadataKey, validator: Function): void {
    const keyToSave = [this.keyPrefix, metadata.method, metadata.argumentIndex, metadata.validatorFunctionName].join(this.keySeparator);
    Reflect.defineMetadata(keyToSave, validator, target as object);
  }

  static getMethodValidationMetadata(target: unknown): MethodValidationMetadataInfo[] {
    const metadataList: MethodValidationMetadataInfo[] = [];
    const metadataKeys: string[] = Reflect.getOwnMetadataKeys(target);
    metadataKeys.forEach(key => {
      if (key.startsWith(this.keyPrefix)) {
        let method, argumentIndex, validatorFunctionName;
        // eslint-disable-next-line prefer-const
        let keyValues = key.split(this.keySeparator);
        keyValues.shift();
        // eslint-disable-next-line prefer-const
        [method, argumentIndex, validatorFunctionName] = keyValues;
        const validatee = { method, argumentIndex, validatorFunctionName };
        const validator: Function = Reflect.getMetadata(key, target);
        metadataList.push({ validatee, validator });
      }
    });
    return metadataList;
  }

  static createParameterValidator(target: unknown, methodName: string, methodParameterIndex: number, validatorFunction: Function): void {
    const metadata: MethodValidationMetadataKey = {
      method: methodName,
      argumentIndex: methodParameterIndex,
      validatorFunctionName: validatorFunction.name,
    };
    ValidationUtil.setMethodValidationMetadata(target, metadata, validatorFunction);
  }
}
