import * as assert from 'assert';
import { CardStack, SpecialRank, Suit } from 'src/core';
import { createQueenOfSpades } from 'testUtils/src/cardUtil';
import { stringCardsArrayToCardStack, cardStackToStringArray } from 'testUtils/src/cardStackUtil';

describe('CardStack', function() {
  describe('#isEmpty()', function() {
    it('should return true is card stack is empty', function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.isEmpty, true);
    });
    it('should return false is card stack is not empty', function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      assert.equal(cardStack.isEmpty, false);
    });
  });
  describe('#cardExists()', function() {
    it('should return true if card exists', function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      assert.equal(cardStack.cardExists(0), true);
    });
    it("should return false is card doesn't exist", function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.cardExists(0), false);
    });
  });
  describe('#getCard()', function() {
    it('should return card if it exists', function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      const card = cardStack.getCard(0);
      assert.equal(card.rank, SpecialRank.QUENN);
      assert.equal(card.suit, Suit.SPADES);
    });
    it("should throw error if card doesn't exist", function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      const block = (): void => {
        cardStack.getCard(5);
      };
      assert.throws(block, { message: `Card with index 5 doesn't exist in card stack ${cardStack.alias}` });
    });
  });
  describe('#putCardStack()', function() {
    it('should do nothing if card stack to put is empty', function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      const cardStackToPut = new CardStack();
      cardStack.putCardStack(cardStackToPut, 0);
      assert.equal(cardStack.cardCount, 1);
    });
    it("should throw error if card with given index doesn't exist in the card stack", function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      const cardStackToPut = new CardStack([createQueenOfSpades()]);
      const block = (): void => {
        cardStack.putCardStack(cardStackToPut, 5);
      };
      assert.throws(block, { message: `Card with index 5 doesn't exist in card stack ${cardStack.alias}` });
    });
    it('should throw error if current card stack is empty but index to put is passed', function() {
      const cardStack = new CardStack();
      const cardStackToPut = new CardStack([createQueenOfSpades()]);
      const block = (): void => {
        cardStack.putCardStack(cardStackToPut, 1);
      };
      assert.throws(block, { message: `Cannot put cards into stack ${cardStack.alias}: target stack is empty so no card index should be passed` });
    });
    it('should throw error if current card stack is not empty but index to put in omitted', function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      const cardStackToPut = new CardStack([createQueenOfSpades()]);
      const block = (): void => {
        cardStack.putCardStack(cardStackToPut);
      };
      assert.throws(block, { message: `Cannot put cards into stack ${cardStack.alias}: card index is missing` });
    });
    describe('should correctly put cards in the stack', function() {
      const tests = [
        { stack: ['20', '30', '60'], toPut: ['40', '50'], index: 1, result: ['20', '30', '40', '50', '60'] },
        { stack: ['20'], toPut: ['30', '40'], index: 0, result: ['20', '30', '40'] },
        { stack: ['20'], toPut: ['30'], index: 0, result: ['20', '30'] },
        { stack: ['20', '30'], toPut: ['40', '50'], index: 1, result: ['20', '30', '40', '50'] },
        { stack: [], toPut: ['10', '20'], result: ['10', '20'] },
        { stack: ['10', '20'], toPut: [], result: ['10', '20'] },
      ];

      for (const [i, test] of tests.entries()) {
        it(`case #${i + 1}`, function() {
          const target = stringCardsArrayToCardStack(test.stack);
          const stack = stringCardsArrayToCardStack(test.toPut);
          if (test.index === void 0) {
            target.putCardStack(stack);
          } else {
            target.putCardStack(stack, test.index);
          }
          const result = cardStackToStringArray(target);
          assert.deepEqual(result, test.result);
        });
      }
    });
  });
});
