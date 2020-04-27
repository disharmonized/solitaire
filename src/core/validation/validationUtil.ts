import 'reflect-metadata';

export interface MethodValidationMetadataKey {
  method: string;
  parameterIndex: number;
  parameterType: ParameterType;
  validatorFunctionName: string;
}

export interface MethodValidationMetadataInfo {
  validatee: MethodValidationMetadataKey;
  validator: Function;
}

export enum ParameterType {
  Ordinary,
  Rest,
}

export class ValidationUtil {
  static keyPrefix = '_validation';
  static keySeparator = '|';

  static setMethodValidationMetadata(target: unknown, metadata: MethodValidationMetadataKey, validator: Function): void {
    const keyToSave = [this.keyPrefix, metadata.method, metadata.parameterType.toString(), metadata.parameterIndex, metadata.validatorFunctionName].join(
      this.keySeparator,
    );
    Reflect.defineMetadata(keyToSave, validator, target as object);
  }

  static getMethodValidationMetadata(target: unknown): MethodValidationMetadataInfo[] {
    const metadataList: MethodValidationMetadataInfo[] = [];
    const metadataKeys: string[] = Reflect.getOwnMetadataKeys(target);
    metadataKeys.forEach(key => {
      if (key.startsWith(this.keyPrefix)) {
        const keyValues = key.split(this.keySeparator);
        keyValues.shift();
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

  static createParameterValidator(target: unknown, methodName: string, methodParameterIndex: number, validatorFunction: Function): void {
    const metadata: MethodValidationMetadataKey = {
      method: methodName,
      parameterIndex: methodParameterIndex,
      validatorFunctionName: validatorFunction.name,
      parameterType: ParameterType.Ordinary,
    };
    ValidationUtil.setMethodValidationMetadata(target, metadata, validatorFunction);
  }

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
