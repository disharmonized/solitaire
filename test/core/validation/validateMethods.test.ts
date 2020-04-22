import * as assert from 'assert';
import { DummyTarget } from 'test/fixtures/validators';

describe('#validate', function() {
  it('should throw error if unknown parameter type is passed to metadata', function() {
    const block = (): void => {
      new DummyTarget().dummyMethod(123);
    };
    assert.throws(block, { message: `Unknown parameter type ${-123}` });
  });
});
