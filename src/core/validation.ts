// import 'reflect-metadata';

// function isValidCardIndex(index: number): boolean {
//   return Number.isInteger(index) && index > -1;
// }

// interface MethodValidationMetadataKey {
//   method: string;
//   argumentIndex: number;
//   validatorFunctionName: string;
// }

// interface MethodValidationMetadataInfo {
//   validatee: MethodValidationMetadataKey;
//   validator: Function;
// }

// class ValidationUtil {
//   static keyPrefix = '_validation';
//   static keySeparator = '-';

//   static setMethodValidationMetadata(target: unknown, metadata: MethodValidationMetadataKey, validator: Function): void {
//     const keyToSave = [this.keyPrefix, metadata.method, metadata.argumentIndex, metadata.validatorFunctionName].join(this.keySeparator);
//     Reflect.defineMetadata(keyToSave, validator, target as object);
//   }

//   static getMethodValidationMetadata(target: unknown): MethodValidationMetadataInfo[] {
//     const metadataList: MethodValidationMetadataInfo[] = [];
//     const metadataKeys: string[] = Reflect.getOwnMetadataKeys(target);
//     metadataKeys.forEach(key => {
//       if (key.startsWith(this.keyPrefix)) {
//         let method, argumentIndex, validatorFunctionName;
//         // eslint-disable-next-line prefer-const
//         let keyValues = key.split(this.keySeparator);
//         keyValues.shift();
//         // eslint-disable-next-line prefer-const
//         [method, argumentIndex, validatorFunctionName] = keyValues;
//         const validatee = { method, argumentIndex, validatorFunctionName };
//         const validator: Function = Reflect.getMetadata(key, target);
//         metadataList.push({ validatee, validator });
//       }
//     });
//     return metadataList;
//   }
// }

// export function validate(target: unknown, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
//   const originalValue = descriptor.value;
//   descriptor.value = function(..._args: unknown[]): typeof originalValue {
//     const metadataList = ValidationUtil.getMethodValidationMetadata(target);
//     const rules = metadataList.filter(value => value.validatee.method === propertyName);
//     rules.forEach(rule => {
//       rule.validator(_args[rule.validatee.argumentIndex]);
//     });
//     return originalValue;
//   };
//   return descriptor;
// }

// function cardIndex(target: unknown, propertyKey: string, index: number): void {
//   const metadata: MethodValidationMetadataKey = {
//     method: propertyKey,
//     argumentIndex: index,
//     validatorFunctionName: isValidCardIndex.name,
//   };
//   ValidationUtil.setMethodValidationMetadata(target, metadata, value => {
//     if (!isValidCardIndex(value)) {
//       throw new Error('Not valid card index');
//     }
//     console.log('valid');
//   });
// }
