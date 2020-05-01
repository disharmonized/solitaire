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
  describe('#addToMe()', function() {
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
    describe('should correctly add cards in the stack', function() {
      const tests = [
        { stack: ['20', '30', '60'], toAdd: ['40', '50'], index: 1, result: ['20', '30', '40', '50', '60'] },
        { stack: ['20'], toAdd: ['30', '40'], index: 0, result: ['20', '30', '40'] },
        { stack: ['20'], toAdd: ['30'], index: 0, result: ['20', '30'] },
        { stack: ['20', '30'], toAdd: ['40', '50'], index: 1, result: ['20', '30', '40', '50'] },
        { stack: [], toAdd: ['10', '20'], result: ['10', '20'] },
        { stack: ['10', '20'], toAdd: [], result: ['10', '20'] },
      ];

      for (const [i, test] of tests.entries()) {
        it(`case #${i + 1}`, function() {
          const target = stringCardsArrayToCardStack(test.stack);
          const stack = stringCardsArrayToCardStack(test.toAdd);
          if (test.index === void 0) {
            target.addToMe(stack);
          } else {
            target.addToMe(stack, test.index);
          }
          const result = cardStackToStringArray(target);
          assert.deepEqual(result, test.result);
        });
      }
    });
  });
});
