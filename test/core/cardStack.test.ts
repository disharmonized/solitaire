import * as assert from 'assert';
import { CardStack, SpecialRank, Suit } from 'src/core';
import { queenOfSpades } from 'testUtils/src/cardUtil';
import { stringCardsArrayToCardStack, cardStackToStringArray } from 'testUtils/src/cardStackUtil';

describe('CardStack', function() {
  describe('#isEmpty()', function() {
    it('should return true is card stack is empty', function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.isEmpty, true);
    });
    it('should return false is card stack is not empty', function() {
      const cardStack = new CardStack([queenOfSpades()]);
      assert.equal(cardStack.isEmpty, false);
    });
  });
  describe('#cardExists()', function() {
    it('should return true if card exists', function() {
      const cardStack = new CardStack([queenOfSpades()]);
      assert.equal(cardStack.cardExists(0), true);
    });
    it("should return false is card doesn't exist", function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.cardExists(0), false);
    });
  });
  describe('#getCard()', function() {
    it('should return card if it exists', function() {
      const cardStack = new CardStack([queenOfSpades()]);
      const card = cardStack.getCard(0);
      assert.equal(card.rank, SpecialRank.QUENN);
      assert.equal(card.suit, Suit.SPADES);
    });
    it("should throw error if card doesn't exist", function() {
      const cardStack = new CardStack([queenOfSpades()]);
      const block = (): void => {
        cardStack.getCard(5);
      };
      assert.throws(block, { message: `Card with index 5 doesn't exist in card stack ${cardStack.alias}` });
    });
  });
  describe('manipulate with card stack', function() {
    interface AddMethodParametersOnTop {
      target: string[];
      beingAdded: string[];
    }

    interface AddMethodParameters extends AddMethodParametersOnTop {
      index?: number;
    }

    interface AddTestCase extends AddMethodParameters {
      result: string[];
    }

    interface AddOnTopTestCase extends AddMethodParametersOnTop {
      result: string[];
    }

    const tests: AddTestCase[] = [
      { target: ['20', '30', '60'], beingAdded: ['40', '50'], index: 1, result: ['20', '30', '40', '50', '60'] },
      { target: ['20'], beingAdded: ['30', '40'], index: 0, result: ['20', '30', '40'] },
      { target: ['20'], beingAdded: ['30'], index: 0, result: ['20', '30'] },
      { target: ['20', '30'], beingAdded: ['40', '50'], index: 1, result: ['20', '30', '40', '50'] },
      { target: [], beingAdded: ['10', '20'], result: ['10', '20'] },
      { target: ['10', '20'], beingAdded: [], result: ['10', '20'] },
    ];

    describe('#addToMe', function() {
      const addToMe = (params: AddMethodParameters): string[] => {
        const target = stringCardsArrayToCardStack(params.target);
        const beingAdded = stringCardsArrayToCardStack(params.beingAdded);
        if (params.index !== void 0) {
          target.addToMe(beingAdded, params.index);
        } else {
          target.addToMe(beingAdded);
        }
        return cardStackToStringArray(target);
      };
      it('should do nothing if card stack being added is empty', function() {
        const cardStack = new CardStack([queenOfSpades()]);
        const cardStackToAdd = new CardStack();
        cardStack.addToMe(cardStackToAdd, 0);
        assert.equal(cardStack.cardCount, 1);
      });
      it("should throw error if card with given index doesn't exist in the card stack", function() {
        const cardStack = new CardStack([queenOfSpades()]);
        const cardStackToAdd = new CardStack([queenOfSpades()]);
        const block = (): void => {
          cardStack.addToMe(cardStackToAdd, 5);
        };
        assert.throws(block, { message: `Card with index 5 doesn't exist in card stack ${cardStack.alias}` });
      });
      it('should throw error if current card stack is empty but card index is passed', function() {
        const cardStack = new CardStack();
        const cardStackToAdd = new CardStack([queenOfSpades()]);
        const block = (): void => {
          cardStack.addToMe(cardStackToAdd, 1);
        };
        assert.throws(block, { message: `Cannot add card stack into stack ${cardStack.alias}: target stack is empty so no card index should be passed` });
      });
      it('should throw error if current card stack is not empty but card index in omitted', function() {
        const cardStack = new CardStack([queenOfSpades()]);
        const cardStackToAdd = new CardStack([queenOfSpades()]);
        const block = (): void => {
          cardStack.addToMe(cardStackToAdd);
        };
        assert.throws(block, { message: `Cannot add card stack into stack ${cardStack.alias}: card index is missing` });
      });
      describe('should correctly add cards to the stack', function() {
        for (const [i, test] of tests.entries()) {
          it(`case #${i + 1}`, function() {
            const result = addToMe({ target: test.target, beingAdded: test.beingAdded, index: test.index });
            assert.deepEqual(result, test.result);
          });
        }
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
        for (const [i, test] of tests.entries()) {
          it(`case #${i + 1}`, function() {
            const result = addMyselfTo({ target: test.target, beingAdded: test.beingAdded, index: test.index });
            assert.deepEqual(result, test.result);
          });
        }
      });
    });
    describe('#addToMeOnTop', function() {
      const addToMeOnTop = (params: AddMethodParameters): string[] => {
        const target = stringCardsArrayToCardStack(params.target);
        const beingAdded = stringCardsArrayToCardStack(params.beingAdded);
        target.addToMeOnTop(beingAdded);
        return cardStackToStringArray(target);
      };

      describe('should correctly add cards on top of the stack', function() {
        const tests: AddOnTopTestCase[] = [
          { target: ['10', '20'], beingAdded: ['30', '40'], result: ['10', '20', '30', '40'] },
          { target: [], beingAdded: ['30', '40'], result: ['30', '40'] },
          { target: ['10', '20'], beingAdded: [], result: ['10', '20'] },
        ];
        for (const [i, test] of tests.entries()) {
          it(`case #${i + 1}`, function() {
            const result = addToMeOnTop({ target: test.target, beingAdded: test.beingAdded });
            assert.deepEqual(result, test.result);
          });
        }
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
        const tests: AddOnTopTestCase[] = [
          { target: ['10', '20'], beingAdded: ['30', '40'], result: ['10', '20', '30', '40'] },
          { target: [], beingAdded: ['30', '40'], result: ['30', '40'] },
          { target: ['10', '20'], beingAdded: [], result: ['10', '20'] },
        ];
        for (const [i, test] of tests.entries()) {
          it(`case #${i + 1}`, function() {
            const result = addMyselfOnTop({ target: test.target, beingAdded: test.beingAdded });
            assert.deepEqual(result, test.result);
          });
        }
      });
    });
  });
});
