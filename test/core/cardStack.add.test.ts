import * as assert from 'assert';
import { CardStackSerializer } from 'testUtils/src/cardStackSerializer';
import { runSeries } from 'testUtils/src/testSeries';

export function addTest(): void {
  type AddMethodParametersOnTop = {
    target: string[];
    beingAdded: string[];
  };

  type AddMethodParameters = AddMethodParametersOnTop & {
    index?: number;
  };
  context('add', function() {
    let serializer: CardStackSerializer;

    type AddResult = {
      result: string[];
      targetCardCount: number;
    };

    type AddResultErrored = {
      targetAlias: string;
      errorMessage: string;
    };

    type AddTestCase = AddMethodParameters & {
      result: string[];
    };

    const tests: AddTestCase[] = [
      { target: ['200', '300', '600'], beingAdded: ['400', '500'], index: 1, result: ['200', '300', '400', '500', '600'] },
      { target: ['200'], beingAdded: ['300', '400'], index: 0, result: ['200', '300', '400'] },
      { target: ['200'], beingAdded: ['300'], index: 0, result: ['200', '300'] },
      { target: ['200', '300'], beingAdded: ['400', '500'], index: 1, result: ['200', '300', '400', '500'] },
      { target: [], beingAdded: ['100', '200'], result: ['100', '200'] },
      { target: ['100', '200'], beingAdded: [], result: ['100', '200'] },
    ];

    beforeEach(function() {
      serializer = new CardStackSerializer({});
    });
    describe('#addToMe', function() {
      const addToMe = (params: AddMethodParameters): AddResult | AddResultErrored => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        const beingAdded = serializer.stringCardsArrayToCardStack(params.beingAdded);
        try {
          if (params.index !== void 0) {
            target.addToMe(beingAdded, params.index);
          } else {
            target.addToMe(beingAdded);
          }
          return { result: serializer.cardStackToStringArray(target), targetCardCount: target.cardCount } as AddResult;
        } catch (error) {
          return {
            targetAlias: target.alias,
            targetCardCount: target.cardCount,
            errorMessage: error.message,
          };
        }
      };
      it('should do nothing if card stack being added is empty', function() {
        const result = addToMe({ target: ['100'], beingAdded: [], index: 0 }) as AddResult;
        assert.equal(result.targetCardCount, 1);
      });
      it("should throw error if card with given index doesn't exist in the card stack", function() {
        const result = addToMe({ target: ['100'], beingAdded: ['100'], index: 5 }) as AddResultErrored;
        assert.equal(result.errorMessage, `Card with index 5 doesn't exist in card stack ${result.targetAlias}`);
      });
      it('should throw error if current card stack is empty but card index is passed', function() {
        const result = addToMe({ target: [], beingAdded: ['100'], index: 1 }) as AddResultErrored;
        assert.equal(result.errorMessage, `Cannot add card stack into stack ${result.targetAlias}: target stack is empty so no card index should be passed`);
      });
      it('should throw error if current card stack is not empty but card index in omitted', function() {
        const result = addToMe({ target: ['100'], beingAdded: ['100'] }) as AddResultErrored;
        assert.equal(result.errorMessage, `Cannot add card stack into stack ${result.targetAlias}: card index is missing`);
      });
      describe('should correctly add cards to the stack', function() {
        runSeries<AddTestCase>(tests, test => {
          const result = addToMe({ target: test.target, beingAdded: test.beingAdded, index: test.index }) as AddResult;
          assert.deepEqual(result.result, test.result);
        });
      });
    });
    describe('#addMyselfTo', function() {
      const addMyselfTo = (params: AddMethodParameters): string[] => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        const beingAdded = serializer.stringCardsArrayToCardStack(params.beingAdded);
        if (params.index !== void 0) {
          beingAdded.addMyselfTo(target, params.index);
        } else {
          beingAdded.addMyselfTo(target);
        }
        return serializer.cardStackToStringArray(target);
      };
      describe('should correctly add cards to the stack', function() {
        runSeries<AddTestCase>(tests, test => {
          const result = addMyselfTo({ target: test.target, beingAdded: test.beingAdded, index: test.index });
          assert.deepEqual(result, test.result);
        });
      });
    });
  });
  context('addOnTop', function() {
    let serializer: CardStackSerializer;

    type AddOnTopTestCase = AddMethodParametersOnTop & {
      result: string[];
    };

    const tests: AddOnTopTestCase[] = [
      { target: ['100', '200'], beingAdded: ['300', '400'], result: ['100', '200', '300', '400'] },
      { target: [], beingAdded: ['300', '400'], result: ['300', '400'] },
      { target: ['100', '200'], beingAdded: [], result: ['100', '200'] },
    ];

    beforeEach(function() {
      serializer = new CardStackSerializer({});
    });
    describe('#addToMeOnTop', function() {
      const addToMeOnTop = (params: AddMethodParameters): string[] => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        const beingAdded = serializer.stringCardsArrayToCardStack(params.beingAdded);
        target.addToMeOnTop(beingAdded);
        return serializer.cardStackToStringArray(target);
      };

      describe('should correctly add cards on top of the stack', function() {
        runSeries<AddOnTopTestCase>(tests, test => {
          const result = addToMeOnTop({ target: test.target, beingAdded: test.beingAdded });
          assert.deepEqual(result, test.result);
        });
      });
    });
    describe('#addMyselfOnTop', function() {
      const addMyselfOnTop = (params: AddMethodParameters): string[] => {
        const target = serializer.stringCardsArrayToCardStack(params.target);
        const beingAdded = serializer.stringCardsArrayToCardStack(params.beingAdded);
        beingAdded.addMyselfOnTop(target);
        return serializer.cardStackToStringArray(target);
      };

      describe('should correctly add cards on top of the stack', function() {
        runSeries<AddOnTopTestCase>(tests, test => {
          const result = addMyselfOnTop({ target: test.target, beingAdded: test.beingAdded });
          assert.deepEqual(result, test.result);
        });
      });
    });
  });
}
