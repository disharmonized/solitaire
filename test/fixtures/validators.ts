/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { validate } from 'src/core/validation/validateMethod';
import { validCardIndex, validCardIndexesRest, validCardNumberToTake } from 'src/core/validation/parameterValidators';
import { ValidationUtil, MethodValidationMetadataKey, ParameterType } from 'src/core/validation/validationUtil';

export class DecoratedClass {
  @validate
  method1(@validCardIndex _param: number): void {}

  @validate
  method2(@validCardIndex _param1: number, @validCardIndex _param2: number): void {}

  @validate
  method3(@validCardIndexesRest ..._param1: number[]): string {
    return _param1.join(',');
  }

  @validate
  method4(@validCardIndex _param1: number, @validCardIndexesRest ..._param2: number[]): string {
    return [_param1, `[${_param2.join(',')}]`].join(',');
  }

  @validate
  method5(@validCardNumberToTake _param: number): void {}
}

export function dummyValidator(target: unknown, methodName: string, methodParameterIndex: number): void {
  const unknownParameterType = -123 as ParameterType;
  const metadata: MethodValidationMetadataKey = {
    method: methodName,
    parameterIndex: methodParameterIndex,
    validatorFunctionName: 'dummyValidatorFunctionName',
    parameterType: unknownParameterType,
  };
  ValidationUtil.setMethodValidationMetadata(target, metadata, (_value: number) => {});
}

export class DummyTarget {
  @validate
  dummyMethod(@dummyValidator _param: number): void {}
}
