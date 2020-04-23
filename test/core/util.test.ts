import * as assert from 'assert';
import { Util } from 'src/core/util';
import { DummyReverseIterableClass } from 'test/fixtures/reverseIterableArrays';

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

describe('ReverseIterableArrayLike', function() {
  it('should correctly iterate in implicit forward mode', function() {
    const iterable = new DummyReverseIterableClass([1, 2, 3]);
    // eslint-disable-next-line prefer-const
    let result = [];
    for (const value of iterable) {
      result.push(value);
    }
    assert.deepEqual(result, [1, 2, 3]);
  });
  it('should correctly iterate in explicit forward mode', function() {
    const iterable = new DummyReverseIterableClass([1, 2, 3]);
    iterable.toForwardIterable();
    // eslint-disable-next-line prefer-const
    let result = [];
    for (const value of iterable) {
      result.push(value);
    }
    assert.deepEqual(result, [1, 2, 3]);
  });
  it('should correctly iterate in reverse mode', function() {
    const iterable = new DummyReverseIterableClass([1, 2, 3]);
    iterable.toReverseIterable();
    // eslint-disable-next-line prefer-const
    let result = [];
    for (const value of iterable) {
      result.push(value);
    }
    assert.deepEqual(result, [3, 2, 1]);
  });
});
