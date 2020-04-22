import { ValidationUtil, ParameterType } from 'src/core/validation/validationUtil';
import { UNKNOWN_PARAMETER_TYPE } from '../errorMessages';

export function validate(target: unknown, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = function(..._args: unknown[]): unknown {
    const metadataList = ValidationUtil.getMethodValidationMetadata(target);
    const rules = metadataList.filter(value => value.validatee.method === propertyName);
    rules.forEach(rule => {
      switch (rule.validatee.parameterType) {
        case ParameterType.Ordinary: {
          rule.validator(_args[rule.validatee.parameterIndex]);
          break;
        }
        case ParameterType.Rest: {
          // Rest parameter is always the last parameter
          const restArray = _args.slice(rule.validatee.parameterIndex);
          rule.validator(restArray);
          break;
        }
        default: {
          throw new Error(UNKNOWN_PARAMETER_TYPE(rule.validatee.parameterType));
        }
      }
    });
    return originalMethod.apply(this, _args);
  };
  return descriptor;
}
