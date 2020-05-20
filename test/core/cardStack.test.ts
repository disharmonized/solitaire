import * as assert from 'assert';
import { CardStack, SpecialRank, Suit } from 'src/core';
import { cardStackToStringArray, stringCardsArrayToCardStack } from 'testUtils/src/cardStackUtil';
import { blackQueenOfSpades } from 'testUtils/src/cardUtil';
import { runSeries } from 'testUtils/src/testSeries';

describe('CardStack', function() {
  describe('#isEmpty()', function() {
    it('should return true is card stack is empty', function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.isEmpty, true);
    });
    it('should return false is card stack is not empty', function() {
      const cardStack = new CardStack([blackQueenOfSpades()]);
      assert.equal(cardStack.isEmpty, false);
    });
  });
  describe('#cardExists()', function() {
    it('should return true if card exists', function() {
      const cardStack = new CardStack([blackQueenOfSpades()]);
      assert.equal(cardStack.cardExists(0), true);
    });
    it("should return false is card doesn't exist", function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.cardExists(0), false);
    });
  });
  describe('#getCard()', function() {
    it('should return card if it exists', function() {
      const cardStack = new CardStack([blackQueenOfSpades()]);
      const card = cardStack.getCard(0);
      assert.equal(card.rank, SpecialRank.QUENN);
      assert.equal(card.suit, Suit.SPADES);
    });
    it("should throw error if card doesn't exist", function() {
      const cardStack = new CardStack([blackQueenOfSpades()]);
      const block = (): void => {
        cardStack.getCard(5);
      };
      assert.throws(block, { message: `Card with index 5 doesn't exist in card stack ${cardStack.alias}` });
    });
  });
  describe('manipulate with card stack', function() {
    type AddMethodParametersOnTop = {
      target: string[];
      beingAdded: string[];
    };

    type AddMethodParameters = AddMethodParametersOnTop & {
      index?: number;
    };
    context('add', function() {
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
      describe('#addToMe', function() {
        const addToMe = (params: AddMethodParameters): AddResult | AddResultErrored => {
          const target = stringCardsArrayToCardStack(params.target);
          const beingAdded = stringCardsArrayToCardStack(params.beingAdded);
          try {
            if (params.index !== void 0) {
              target.addToMe(beingAdded, params.index);
            } else {
              target.addToMe(beingAdded);
            }
            return { result: cardStackToStringArray(target), targetCardCount: target.cardCount } as AddResult;
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
          const target = stringCardsArrayToCardStack(params.target);
          const beingAdded = stringCardsArrayToCardStack(params.beingAdded);
          if (params.index !== void 0) {
            beingAdded.addMyselfTo(target, params.index);
          } else {
            beingAdded.addMyselfTo(target);
          }
          return cardStackToStringArray(target);
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
      type AddOnTopTestCase = AddMethodParametersOnTop & {
        result: string[];
      };
      const tests: AddOnTopTestCase[] = [
        { target: ['100', '200'], beingAdded: ['300', '400'], result: ['100', '200', '300', '400'] },
        { target: [], beingAdded: ['300', '400'], result: ['300', '400'] },
        { target: ['100', '200'], beingAdded: [], result: ['100', '200'] },
      ];
      describe('#addToMeOnTop', function() {
        const addToMeOnTop = (params: AddMethodParameters): string[] => {
          const target = stringCardsArrayToCardStack(params.target);
          const beingAdded = stringCardsArrayToCardStack(params.beingAdded);
          target.addToMeOnTop(beingAdded);
          return cardStackToStringArray(target);
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
          const target = stringCardsArrayToCardStack(params.target);
          const beingAdded = stringCardsArrayToCardStack(params.beingAdded);
          beingAdded.addMyselfOnTop(target);
          return cardStackToStringArray(target);
        };

        describe('should correctly add cards on top of the stack', function() {
          runSeries<AddOnTopTestCase>(tests, test => {
            const result = addMyselfOnTop({ target: test.target, beingAdded: test.beingAdded });
            assert.deepEqual(result, test.result);
          });
        });
      });
    });

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
        type TakeTestCase = TakeMethodParameters & TakeResult;
        const tests: TakeTestCase[] = [
          { target: ['100', '200', '300'], index: 0, numberToTake: 3, result: ['100', '200', '300'], targetAfter: [] },
          { target: ['100', '200', '300'], index: 0, numberToTake: 2, result: ['100', '200'], targetAfter: ['300'] },
          { target: ['100', '200', '300'], index: 0, numberToTake: 1, result: ['100'], targetAfter: ['200', '300'] },
          { target: ['100', '200', '300'], index: 1, numberToTake: 2, result: ['200', '300'], targetAfter: ['100'] },
          { target: ['100', '200', '300'], index: 1, numberToTake: 1, result: ['200'], targetAfter: ['100', '300'] },
          { target: ['100', '200', '300'], index: 2, numberToTake: 1, result: ['300'], targetAfter: ['100', '200'] },
        ];
        const take = (params: TakeMethodParameters): TakeResult | TakeResultErrored => {
          const target = stringCardsArrayToCardStack(params.target);
          try {
            const result = target.take(params.index, params.numberToTake);
            return {
              result: cardStackToStringArray(result),
              targetAfter: cardStackToStringArray(target),
            };
          } catch (error) {
            return {
              targetAlias: target.alias,
              targetCardCount: target.cardCount,
              error: error,
            };
          }
        };

        describe('should correctly take cards', function() {
          runSeries<TakeTestCase>(tests, test => {
            const result = take({ target: test.target, index: test.index, numberToTake: test.numberToTake }) as TakeResult;
            assert.deepEqual(result.result, test.result);
            assert.deepEqual(result.targetAfter, test.targetAfter);
          });
        });
        describe('should throw error if card stack is empty', function() {
          const result = take({ target: [], index: 0, numberToTake: 1 }) as TakeResultErrored;
          assert.equal(result.error.message, `Cannot take cards from card stack ${result.targetAlias}: stack is empty`);
        });
        describe('should throw error if number of cards to take is invalid', function() {
          const test: TakeMethodParameters = { target: ['100', '200'], index: 0, numberToTake: 3 };
          const result = take(test) as TakeResultErrored;
          assert.equal(
            result.error.message,
            `Cannot take ${test.numberToTake} cards from card stack ${result.targetAlias}: only ${result.targetCardCount -
              test.index} cards are available to take`,
          );
        });
      });
      describe('#takeTop', function() {
        type TakeTopTestCase = TakeTopMethodParameters & TakeResult;
        const tests: TakeTopTestCase[] = [
          { target: ['100', '200', '300'], numberToTake: 3, result: ['100', '200', '300'], targetAfter: [] },
          { target: ['100', '200', '300'], numberToTake: 2, result: ['200', '300'], targetAfter: ['100'] },
          { target: ['100', '200', '300'], numberToTake: 1, result: ['300'], targetAfter: ['100', '200'] },
        ];
        const takeTop = (params: TakeTopMethodParameters): TakeResult | TakeResultErrored => {
          const target = stringCardsArrayToCardStack(params.target);
          try {
            const result = target.takeTop(params.numberToTake);
            return {
              result: cardStackToStringArray(result),
              targetAfter: cardStackToStringArray(target),
            };
          } catch (error) {
            return {
              targetAlias: target.alias,
              targetCardCount: target.cardCount,
              error: error,
            };
          }
        };

        describe('should correctly take top cards of the card stack', function() {
          runSeries<TakeTopTestCase>(tests, test => {
            const result = takeTop({ target: test.target, numberToTake: test.numberToTake }) as TakeResult;
            assert.deepEqual(result.result, test.result);
            assert.deepEqual(result.targetAfter, test.targetAfter);
          });
        });
        describe('should throw error if number of cards to take is invalid', function() {
          const test: TakeTopMethodParameters = { target: ['100', '200'], numberToTake: 3 };
          const result = takeTop(test) as TakeResultErrored;
          assert.equal(
            result.error.message,
            `Cannot take ${test.numberToTake} cards from card stack ${result.targetAlias}: only ${result.targetCardCount} cards are available to take`,
          );
        });
      });
    });
  });
});
