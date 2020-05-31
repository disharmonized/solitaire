import * as assert from 'assert';
import { Card } from 'src/core';
import { StandardCardStackSerializer } from 'testUtils/src/cardStackSerializer';
import { SimpleCardColors } from 'testUtils/src/cardUtil';

export function sortTest(): void {
  context('#sort', function() {
    let serializer: StandardCardStackSerializer;

    type SortMethodParameters = {
      target: string[];
      compareFn: (a: Card, b: Card) => -1 | 1 | 0;
    };

    type TestCase = SortMethodParameters & {
      result: string[];
    };

    type Result = {
      result: string[];
    };

    const sort = (params: SortMethodParameters): Result => {
      const target = serializer.stringCardsArrayToCardStack(params.target);
      target.sort(params.compareFn);
      return { result: serializer.cardStackToStringArray(target) };
    };

    beforeEach(function() {
      serializer = new StandardCardStackSerializer({});
    });

    it('should correctly sort cards', function() {
      const compareFn = (a: Card, b: Card): -1 | 0 | 1 => {
        const sortByRank = (a: Card, b: Card): -1 | 0 | 1 => {
          if (a.rank > b.rank) {
            return 1;
          } else if (a.rank < b.rank) {
            return -1;
          } else return 0;
        };
        const sortBySuit = (a: Card, b: Card): -1 | 0 | 1 => {
          if (a.suit > b.suit) {
            return 1;
          } else if (a.suit < b.suit) {
            return -1;
          } else return 0;
        };
        const sortByColor = (a: Card, b: Card): -1 | 0 | 1 => {
          const aColorIndex = SimpleCardColors.All.indexOf(a.color as SimpleCardColors);
          const bColorIndex = SimpleCardColors.All.indexOf(b.color as SimpleCardColors);
          if (aColorIndex > bColorIndex) {
            return 1;
          } else if (aColorIndex < bColorIndex) {
            return -1;
          } else {
            return 0;
          }
        };
        const r = sortByRank(a, b);
        const s = sortBySuit(a, b);
        const c = sortByColor(a, b);
        return c !== 0 ? c : s !== 0 ? s : r;
      };
      const sorted = [
        '100',
        '200',
        '300',
        '110',
        '210',
        '310',
        '120',
        '220',
        '320',
        '101',
        '201',
        '301',
        '111',
        '211',
        '311',
        '121',
        '221',
        '321',
        '102',
        '202',
        '302',
        '112',
        '212',
        '312',
        '122',
        '222',
        '322',
      ];
      const unsorted = sorted.slice().reverse(); // copy sorted array and reverse it to get unsorted array
      const test: TestCase = { target: unsorted, result: sorted, compareFn: compareFn };
      const result = sort({ target: test.target, compareFn: test.compareFn });
      assert.deepEqual(result.result, test.result);
    });
  });
}
