import { Rank } from 'src/core';
import { RankValueBounds } from 'src/core';
import { INVALID_RANK_VALUE } from 'src/core/errorMessages';

/**
 * Class Util. Various utility methods.
 */
export class Util {
  /**
   * N -> [0, 1, 2, ..., N-1]
   * @param size
   */
  static createArrayOfSeqIndexes(size: number): number[] {
    return new Array(size).fill(null).map((_v, i) => i);
  }
}

/**
 * Interface for creating reverse iteratables.
 */
export interface ReverseIterable<T> extends Iterable<T> {
  /**
   * Switches to reverse iterating
   */
  toReverseIterable(): void;
  /**
   * Switches to forward iterating
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
   * Returns ArrayLike object to iterate on
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

export function parseRank(value: number): Rank {
  if (value >= RankValueBounds.START_VALUE && value <= RankValueBounds.END_VALUE) {
    return value as Rank;
  }
  throw new Error(INVALID_RANK_VALUE(value));
}
