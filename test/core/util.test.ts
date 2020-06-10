import * as assert from 'assert';
import { Anomalies, Util } from 'src/core/util';
import { DummyReverseIterableClass } from 'test/fixtures/reverseIterableArrays';
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
  describe('#compareArraysAndFindAnomalies', () => {
    type TestCase = {
      target: number[];
      validatee: number[];
      validator: (value: number) => boolean;
      result: Anomalies;
    };
    const runTests = (tests: TestCase[]): void => {
      runSeries(tests, test => {
        const result = Util.compareArraysAndFindAnomalies(test.target, test.validatee, test.validator);
        assert.deepEqual(result, test.result);
      });
    };
    describe('should correctly detect invalid indexes', () => {
      const validator = (value: number): boolean => value <= 3;
      const tests = [{ target: [0, 1, 2, 3, 4, 5], validatee: [0, 1, 2, 3, 4, 5], validator, result: { notFound: [], invalid: [4, 5], duplicates: [] } }];
      runTests(tests);
    });
    describe('should correctly detect not found indexes', () => {
      const validator = (): boolean => true;
      const tests = [
        { target: [0, 1, 2, 3], validatee: [0, 1, -1, -2, 3], validator, result: { notFound: [-1, -2], invalid: [], duplicates: [] } },
        { target: [], validatee: [0, 1, 2], validator, result: { notFound: [0, 1, 2], invalid: [], duplicates: [] } },
      ];
      runTests(tests);
    });
    describe('should correctly detect duplicate indexes', () => {
      const validator = (): boolean => true;
      const tests = [{ target: [0, 1, 2, 3], validatee: [0, 1, 3, 2, 2, 3], validator, result: { notFound: [], invalid: [], duplicates: [2, 3] } }];
      runTests(tests);
    });
    describe('should correctly detect multiple anomalies', () => {
      const validator = (value: number): boolean => value <= 3 && value >= 0;
      const tests = [
        { target: [0, 1, 2, 3], validatee: [0, 1, 3, 2, 2, 3, -1, -2], validator, result: { notFound: [-1, -2], invalid: [-1, -2], duplicates: [2, 3] } },
        {
          target: [],
          validatee: [0, 1, 3, 2, 2, 3, -1, -2, 4, 5],
          validator,
          result: { notFound: [0, 1, 3, 2, -1, -2, 4, 5], invalid: [-1, -2, 4, 5], duplicates: [2, 3] },
        },
        { target: [0, 1, 2, 3], validatee: [], validator, result: { notFound: [], invalid: [], duplicates: [] } },
      ];
      runTests(tests);
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
