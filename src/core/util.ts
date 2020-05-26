import {
  RANGE_START_VALUE_EQUALS_END_VALUE,
  RANGE_START_VALUE_IS_GREATER_THEN_END_VALUE as RANGE_START_VALUE_IS_GREATER_THAN_END_VALUE,
} from 'src/core/errorMessages';

/**
 * Class Util. Contains various utility methods.
 */
export class Util {
  /**
   * Creates array of range nof non-negative integers. Latter bound is non-inclusive.
   * @example
   * Util.range(3); // returns [0, 1, 2]
   * Util.range({start: 1, end: 4}); // returns [1, 2, 3]
   * @throws error if input values are not non-negative integers.
   * @throws error if start value is greater than end value.
   * @throws error if start value equals end value.
   * @param {number | { start: number; end: number }} sizeOrRange size of range (equivalent of { start: 0; end: size }) or range.
   */
  static range(sizeOrRange: number | { start: number; end: number }): number[] {
    let start: number, length: number;
    if (typeof sizeOrRange === 'number') {
      length = sizeOrRange;
      start = 0;
    } else {
      if (sizeOrRange.start > sizeOrRange.end) {
        throw new Error(RANGE_START_VALUE_IS_GREATER_THAN_END_VALUE(sizeOrRange.start, sizeOrRange.end));
      }
      if (sizeOrRange.start === sizeOrRange.end) {
        throw new Error(RANGE_START_VALUE_EQUALS_END_VALUE(sizeOrRange.start));
      }
      length = sizeOrRange.end - sizeOrRange.start;
      start = sizeOrRange.start;
    }
    return Array.from({ length }, (_, i) => start + i);
  }
}

/**
 * Interface for creating reverse iteratables.
 */
export interface ReverseIterable<T> extends Iterable<T> {
  /**
   * Switches to reverse iterating.
   */
  toReverseIterable(): void;
  /**
   * Switches to forward iterating.
   */
  toForwardIterable(): void;
}

/**
 * Class for implementing reverse iterable ArrayLike.
 * By default, reverse mode is disabled, i.e. iterating will be going in forward mode.
 */
export abstract class ReverseIterableArrayLike<T> implements ReverseIterable<T> {
  private inReverseMode = false;

  /**
   * Returns ArrayLike object to iterate on.
   */
  protected abstract getIteratee(): ArrayLike<T>;

  toReverseIterable(): void {
    this.inReverseMode = true;
  }

  toForwardIterable(): void {
    this.inReverseMode = false;
  }

  [Symbol.iterator](): Iterator<T> {
    if (this.inReverseMode) {
      return this.getReverseIterator();
    } else {
      return this.getForwardIterator();
    }
  }

  /**
   * Returns forward iterator.
   */
  private getForwardIterator(): Iterator<T> {
    const array = this.getIteratee();
    let current = 0;
    return {
      next(): IteratorResult<T> {
        if (current < array.length) {
          return {
            value: array[current++],
            done: false,
          };
        } else {
          return {
            value: null,
            done: true,
          };
        }
      },
    };
  }

  /**
   * Returns reverse iterator.
   */
  private getReverseIterator(): Iterator<T> {
    const array = this.getIteratee();
    let current = array.length - 1;
    return {
      next(): IteratorResult<T> {
        if (current > -1) {
          return {
            value: array[current--],
            done: false,
          };
        } else {
          return {
            value: null,
            done: true,
          };
        }
      },
    };
  }
}
