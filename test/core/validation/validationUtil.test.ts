import * as assert from 'assert';
import 'reflect-metadata';
import { ValidationUtil } from 'src/core/validation/validationUtil';

describe('ValidationUtil', function() {
  describe('#getMethodValidationMetadata', function() {
    it('should return empty list if no validation decorator attached to the target', function() {
      const dummyTarget = {};
      Reflect.defineMetadata('dummyKey', 'dummyValue', dummyTarget);
      const metadataList = ValidationUtil.getMethodValidationMetadata(dummyTarget);
      assert.deepEqual(metadataList, []);
    });
  });
});
