import { UNKNOWN_PARAMETER_TYPE } from 'src/core/errorMessages';
import { ParameterType, ValidationUtil } from 'src/core/validation/validationUtil';

/**
 * Implements @validate method decorator.
 * @param {Object} target Class prototype.
 * @param {string} propertyName Name of the property.
 * @param {number} descriptor Property descriptor.
 * @throws Error if parameterType passed into descriptor metadata is unknown.
 */
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
