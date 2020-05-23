import * as assert from 'assert';
import { CardStackSerializer } from 'testUtils/src/cardStackSerializer';
import { runSeries } from 'testUtils/src/testSeries';

export function turnAroundTest(): void {
  context('turnAround', function() {
    let serializer: CardStackSerializer;

    beforeEach(function() {
      serializer = new CardStackSerializer({ isFacedUpIncluded: true });
    });

    type Result = {
      result: string[];
    };

    type ResultErrored = {
      errorMessage: string;
    };

    describe('#turnCardsAround', function() {
      type MethodParameters = {
        target: string[];
        indexes: number[];
      };

      type TestCase = MethodParameters & {
        result?: string[];
        notFoundIndexes?: number[];
      };

      const turnCardsAround = (params: MethodParameters): Result | ResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        try {
          target.turnCardsAround(...params.indexes);
          return { result: serializer.cardStackToStringArray(target) } as Result;
        } catch (error) {
          return {
            errorMessage: error.message,
          };
        }
      };

      it('should throw error if card stack is empty', function() {
        const result = turnCardsAround({ target: [], indexes: [0] }) as ResultErrored;
        assert.equal(result.errorMessage, `Cannot turn around cards in empty card stack`);
      });

      describe("should throw error if some of the cards indexes passed doesn't exist in card stack", function() {
        const tests: TestCase[] = [
          { target: ['100+'], indexes: [1], notFoundIndexes: [1] },
          { target: ['100+', '100+', '100+'], indexes: [0, 1, 2, 3], notFoundIndexes: [3] },
          { target: ['100+', '100+', '100+'], indexes: [0, 1, 2, 3, 3], notFoundIndexes: [3] },
          { target: ['100+', '100+', '100+'], indexes: [0, 1, 3, 2], notFoundIndexes: [3] },
          { target: ['100+', '100+', '100+'], indexes: [3, 1, 3, 2], notFoundIndexes: [3] },
          { target: ['100+', '100+', '100+'], indexes: [3, 3, 3, 3], notFoundIndexes: [3] },
          { target: ['100+', '100+', '100+'], indexes: [3, 4, 5, 3], notFoundIndexes: [3, 4, 5] },
          { target: ['100+', '100+', '100+'], indexes: [3, 4, 5, 3], notFoundIndexes: [3, 4, 5] },
          { target: ['100+', '100+', '100+'], indexes: [3, 4, 5, 2], notFoundIndexes: [3, 4, 5] },
        ];
        runSeries<TestCase>(tests, test => {
          const result = turnCardsAround({ target: test.target, indexes: test.indexes }) as ResultErrored;
          assert.equal(result.errorMessage, `Cannot turn around cards: indexes ${test.notFoundIndexes.join(',')} don't exist in card stack`);
        });
      });

      describe('should correctly turn around cards', function() {
        const tests: TestCase[] = [
          { target: ['100+'], indexes: [0], result: ['100-'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [0], result: ['100-', '200+', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [1], result: ['100+', '200-', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [2], result: ['100+', '200+', '300-', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [3], result: ['100+', '200+', '300+', '400-'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [0, 1], result: ['100-', '200-', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [0, 0], result: ['100-', '200+', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [1, 3], result: ['100+', '200-', '300+', '400-'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [0, 1, 2, 3], result: ['100-', '200-', '300-', '400-'] },
          { target: ['100+', '200+', '300+', '400+'], indexes: [1, 1, 3, 3], result: ['100+', '200-', '300+', '400-'] },
        ];
        runSeries<TestCase>(tests, test => {
          const result = turnCardsAround({ target: test.target, indexes: test.indexes }) as Result;
          assert.deepEqual(result.result, test.result);
        });
      });
    });

    describe('#turnCardRangeAround', function() {
      type MethodParameters = {
        target: string[];
        startIndex: number;
        endIndex: number;
      };

      type TestCase = MethodParameters & {
        result?: string[];
        notFoundIndexes?: number[];
        expectedErrorMessage?: string;
      };

      const turnCardRangeAround = (params: MethodParameters): Result | ResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        try {
          target.turnCardRangeAround(params.startIndex, params.endIndex);
          return { result: serializer.cardStackToStringArray(target) } as Result;
        } catch (error) {
          return {
            errorMessage: error.message,
          };
        }
      };

      describe('should throw error if start index is greater on equals end index', function() {
        const tests: TestCase[] = [
          {
            target: ['100+'],
            startIndex: 0,
            endIndex: 0,
            expectedErrorMessage: 'Cannot turn around cards: start card index value 0 is greater or equals end card index value 0',
          },
          {
            target: ['100+'],
            startIndex: 1,
            endIndex: 0,
            expectedErrorMessage: 'Cannot turn around cards: start card index value 1 is greater or equals end card index value 0',
          },
        ];
        runSeries<TestCase>(tests, test => {
          const result = turnCardRangeAround({ target: test.target, startIndex: test.startIndex, endIndex: test.endIndex }) as ResultErrored;
          assert.equal(result.errorMessage, test.expectedErrorMessage);
        });
      });

      describe('should correctly turn around card range', function() {
        const tests: TestCase[] = [
          { target: ['100+'], startIndex: 0, endIndex: 1, result: ['100-'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 0, endIndex: 1, result: ['100-', '200+', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 0, endIndex: 2, result: ['100-', '200-', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 0, endIndex: 3, result: ['100-', '200-', '300-', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 0, endIndex: 4, result: ['100-', '200-', '300-', '400-'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 1, endIndex: 2, result: ['100+', '200-', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 1, endIndex: 3, result: ['100+', '200-', '300-', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 1, endIndex: 4, result: ['100+', '200-', '300-', '400-'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 2, endIndex: 3, result: ['100+', '200+', '300-', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 2, endIndex: 4, result: ['100+', '200+', '300-', '400-'] },
          { target: ['100+', '200+', '300+', '400+'], startIndex: 3, endIndex: 4, result: ['100+', '200+', '300+', '400-'] },
        ];
        runSeries<TestCase>(tests, test => {
          const result = turnCardRangeAround({ target: test.target, startIndex: test.startIndex, endIndex: test.endIndex }) as Result;
          assert.deepEqual(result.result, test.result);
        });
      });
    });

    describe('#turnTopCardsAround', function() {
      type MethodParameters = {
        target: string[];
        number: number;
      };

      type TestCase = MethodParameters & {
        result?: string[];
      };

      const turnTopCardsAround = (params: MethodParameters): Result | ResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        try {
          target.turnTopCardsAround(params.number);
          return { result: serializer.cardStackToStringArray(target) } as Result;
        } catch (error) {
          return {
            errorMessage: error.message,
          };
        }
      };

      it('should throw error if number of cards exceeds cards count in the stack', function() {
        const result = turnTopCardsAround({ target: ['100+'], number: 2 }) as ResultErrored;
        assert.equal(result.errorMessage, `Cannot turn top cards around: number of cards 2 exceeds number of cards 1 in the stack`);
      });

      it('should throw error if cards stack is empty', function() {
        const result = turnTopCardsAround({ target: [], number: 1 }) as ResultErrored;
        assert.equal(result.errorMessage, `Cannot turn around cards in empty card stack`);
      });

      describe('should correctly turn around cards', function() {
        const tests: TestCase[] = [
          { target: ['100+'], number: 1, result: ['100-'] },
          { target: ['100+', '200+', '300+', '400+'], number: 1, result: ['100-', '200+', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], number: 2, result: ['100-', '200-', '300+', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], number: 3, result: ['100-', '200-', '300-', '400+'] },
          { target: ['100+', '200+', '300+', '400+'], number: 4, result: ['100-', '200-', '300-', '400-'] },
        ];
        runSeries<TestCase>(tests, test => {
          const result = turnTopCardsAround({ target: test.target, number: test.number }) as Result;
          assert.deepEqual(result.result, test.result);
        });
      });
    });

    describe('#turnTopCardAround', function() {
      type MethodParameters = {
        target: string[];
      };

      type TestCase = MethodParameters & {
        result?: string[];
      };

      const turnTopCardAround = (params: MethodParameters): Result | ResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        try {
          target.turnTopCardAround();
          return { result: serializer.cardStackToStringArray(target) } as Result;
        } catch (error) {
          return {
            errorMessage: error.message,
          };
        }
      };

      describe('should correctly turn top card around', function() {
        const tests: TestCase[] = [
          { target: ['100+'], result: ['100-'] },
          { target: ['100+', '200+'], result: ['100-', '200+'] },
        ];
        runSeries<TestCase>(tests, test => {
          const result = turnTopCardAround({ target: test.target }) as Result;
          assert.deepEqual(result.result, test.result);
        });
      });
    });
  });
}
