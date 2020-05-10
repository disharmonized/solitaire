import * as assert from 'assert';
import { Util, parseRank } from 'src/core/util';
import { DummyReverseIterableClass } from 'test/fixtures/reverseIterableArrays';
import { RankValueBounds } from 'src/core';
import { runSeries } from 'testUtils/src/testSeries';

describe('Util', function() {
  describe('#range()', function() {
    context('positive cases', function() {
      const tests = [
        { startOrRange: 1, result: [0] },
        { startOrRange: 3, result: [0, 1, 2] },
        { startOrRange: { start: 0, end: 1 }, result: [0] },
        { startOrRange: { start: 0, end: 2 }, result: [0, 1] },
        { startOrRange: { start: 1, end: 2 }, result: [1] },
        { startOrRange: { start: 1, end: 3 }, result: [1, 2] },
        { startOrRange: { start: 5, end: 8 }, result: [5, 6, 7] },
      ];
      runSeries(tests, test => {
        assert.deepEqual(Util.range(test.startOrRange), test.result);
      });
    });
    context('negative cases', function() {
      const tests = [
        { startOrRange: { start: 1, end: 0 }, expectedErrorMessage: 'Cannot create range: start value 1 is greater than end value 0' },
        { startOrRange: { start: 1, end: 1 }, expectedErrorMessage: 'Cannot create range: start value 1 equals end value' },
      ];
      runSeries(tests, test => {
        assert.throws(() => Util.range(test.startOrRange), { message: test.expectedErrorMessage });
      });
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
    const result = [];
    for (const value of iterable) {
      result.push(value);
    }
    assert.deepEqual(result, [1, 2, 3]);
  });
  it('should correctly iterate in explicit forward mode', function() {
    const iterable = new DummyReverseIterableClass([1, 2, 3]);
    iterable.toForwardIterable();
    const result = [];
    for (const value of iterable) {
      result.push(value);
    }
    assert.deepEqual(result, [1, 2, 3]);
  });
  it('should correctly iterate in reverse mode', function() {
    const iterable = new DummyReverseIterableClass([1, 2, 3]);
    iterable.toReverseIterable();
    const result = [];
    for (const value of iterable) {
      result.push(value);
    }
    assert.deepEqual(result, [3, 2, 1]);
  });
});
