import * as assert from 'assert';
import { Util, parseRank } from 'src/core/util';
import { DummyReverseIterableClass } from 'test/fixtures/reverseIterableArrays';
import { RankValueBounds } from 'src/core';

describe('Util', function() {
  describe('#createArrayOfSeqIndexes()', function() {
    it('should return correct value for N=1', function() {
      assert.deepEqual(Util.createArrayOfSeqIndexes(1), [0]);
    });
    it('should return correct value for N=3', function() {
      assert.deepEqual(Util.createArrayOfSeqIndexes(3), [0, 1, 2]);
    });
  });
  describe('#parseRank()', function() {
    it('should correctly parse value if it is inside boundaries', function() {
      assert.doesNotThrow(() => parseRank(1));
    });
    it('should throw error if value is outside boundaries', function() {
      assert.throws(() => parseRank(-1), { message: `Invalid rank value -1: should be >= ${RankValueBounds.START_VALUE} and <= ${RankValueBounds.END_VALUE}` });
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
