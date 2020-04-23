import { ReverseIterableArrayLike } from 'src/core/util';

export class DummyReverseIterableClass extends ReverseIterableArrayLike<number> {
  constructor(private iteratee: number[]) {
    super();
  }
  protected getIteratee(): ArrayLike<number> {
    return this.iteratee;
  }
}
