import * as assert from 'assert';
import { CardStackSerializer } from 'testUtils/src/cardStackSerializer';
import { runSeries } from 'testUtils/src/testSeries';

export function takeTest(): void {
  context('take', function() {
    type TakeTopMethodParameters = {
      target: string[];
      numberToTake: number;
    };

    type TakeMethodParameters = TakeTopMethodParameters & {
      index: number;
    };

    type TakeResult = {
      result: string[];
      targetAfter: string[];
    };

    type TakeResultErrored = {
      targetAlias: string;
      targetCardCount: number;
      error: Error;
    };

    describe('#take', function() {
      let serializer: CardStackSerializer;

      type TakeTestCase = TakeMethodParameters & TakeResult;

      const take = (params: TakeMethodParameters): TakeResult | TakeResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        try {
          const result = target.take(params.index, params.numberToTake);
          return {
            result: serializer.cardStackToStringArray(result),
            targetAfter: serializer.cardStackToStringArray(target),
          };
        } catch (error) {
          return {
            targetAlias: target.alias,
            targetCardCount: target.cardCount,
            error: error,
          };
        }
      };

      beforeEach(function() {
        serializer = new CardStackSerializer({});
      });

      it('should throw error if card stack is empty', function() {
        const result = take({ target: [], index: 0, numberToTake: 1 }) as TakeResultErrored;
        assert.equal(result.error.message, `Cannot take cards from card stack ${result.targetAlias}: stack is empty`);
      });
      it('should throw error if number of cards to take is invalid', function() {
        const test: TakeMethodParameters = { target: ['100', '200'], index: 0, numberToTake: 3 };
        const result = take(test) as TakeResultErrored;
        assert.equal(
          result.error.message,
          `Cannot take ${test.numberToTake} cards from card stack ${result.targetAlias}: only ${result.targetCardCount -
            test.index} cards are available to take`,
        );
      });
      describe('should correctly take cards', function() {
        const tests: TakeTestCase[] = [
          { target: ['100', '200', '300'], index: 0, numberToTake: 3, result: ['100', '200', '300'], targetAfter: [] },
          { target: ['100', '200', '300'], index: 0, numberToTake: 2, result: ['100', '200'], targetAfter: ['300'] },
          { target: ['100', '200', '300'], index: 0, numberToTake: 1, result: ['100'], targetAfter: ['200', '300'] },
          { target: ['100', '200', '300'], index: 1, numberToTake: 2, result: ['200', '300'], targetAfter: ['100'] },
          { target: ['100', '200', '300'], index: 1, numberToTake: 1, result: ['200'], targetAfter: ['100', '300'] },
          { target: ['100', '200', '300'], index: 2, numberToTake: 1, result: ['300'], targetAfter: ['100', '200'] },
        ];
        runSeries<TakeTestCase>(tests, test => {
          const result = take({ target: test.target, index: test.index, numberToTake: test.numberToTake }) as TakeResult;
          assert.deepEqual(result.result, test.result);
          assert.deepEqual(result.targetAfter, test.targetAfter);
        });
      });
    });
    describe('#takeTop', function() {
      let serializer: CardStackSerializer;

      type TakeTopTestCase = TakeTopMethodParameters & TakeResult;

      const takeTop = (params: TakeTopMethodParameters): TakeResult | TakeResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        try {
          const result = target.takeTop(params.numberToTake);
          return {
            result: serializer.cardStackToStringArray(result),
            targetAfter: serializer.cardStackToStringArray(target),
          };
        } catch (error) {
          return {
            targetAlias: target.alias,
            targetCardCount: target.cardCount,
            error: error,
          };
        }
      };

      beforeEach(function() {
        serializer = new CardStackSerializer({});
      });

      describe('should correctly take top cards of the card stack', function() {
        const tests: TakeTopTestCase[] = [
          { target: ['100', '200', '300'], numberToTake: 3, result: ['100', '200', '300'], targetAfter: [] },
          { target: ['100', '200', '300'], numberToTake: 2, result: ['200', '300'], targetAfter: ['100'] },
          { target: ['100', '200', '300'], numberToTake: 1, result: ['300'], targetAfter: ['100', '200'] },
        ];
        runSeries<TakeTopTestCase>(tests, test => {
          const result = takeTop({ target: test.target, numberToTake: test.numberToTake }) as TakeResult;
          assert.deepEqual(result.result, test.result);
          assert.deepEqual(result.targetAfter, test.targetAfter);
        });
      });
      it('should throw error if number of cards to take is invalid', function() {
        const test: TakeTopMethodParameters = { target: ['100', '200'], numberToTake: 3 };
        const result = takeTop(test) as TakeResultErrored;
        assert.equal(
          result.error.message,
          `Cannot take ${test.numberToTake} cards from card stack ${result.targetAlias}: only ${result.targetCardCount} cards are available to take`,
        );
      });
    });
  });
}
