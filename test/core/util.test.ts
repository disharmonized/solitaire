import * as assert from 'assert';
import { Util } from 'src/core/util';

describe('Util', function() {
  describe('#createArrayOfSeqIndexes()', function() {
    it('should return correct value for N=1', function() {
      assert.deepEqual(Util.createArrayOfSeqIndexes(1), [0]);
    });
    it('should return correct value for N=3', function() {
      assert.deepEqual(Util.createArrayOfSeqIndexes(3), [0, 1, 2]);
    });
  });
});
