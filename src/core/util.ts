/**
 * N -> [0, 1, 2, ..., N-1]
 * @param size
 */
export function createArrayOfSeqIndexes(size: number): number[] {
  return new Array(size).fill(null).map((_v, i) => i);
}
