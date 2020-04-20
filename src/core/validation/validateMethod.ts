import { ValidationUtil } from 'src/core/validation/validationUtil';

export function validate(target: unknown, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalValue = descriptor.value;
  descriptor.value = function(..._args: unknown[]): typeof originalValue {
    const metadataList = ValidationUtil.getMethodValidationMetadata(target);
    const rules = metadataList.filter(value => value.validatee.method === propertyName);
    rules.forEach(rule => {
      rule.validator(_args[rule.validatee.argumentIndex]);
    });
    return originalValue;
  };
  return descriptor;
}
