import * as assert from 'assert';
import { CardStack } from 'src/core';
import { createQueenOfSpades } from 'testUtils/src/cardUtil';
// import { stringCardsArrayToCardStack, cardStackToStringArray } from 'src/core/cardStackUtil';

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
    // it('should', function() {
    //   const target = stringCardsArrayToCardStack(['20', '30', '60']);
    //   const stack = stringCardsArrayToCardStack(['40', '50']);
    //   const expected = ['20', '30', '40', '50', '60'];
    //   target.putCardStack(stack, 1);
    //   const actual = cardStackToStringArray(target);
    //   assert.deepEqual(actual, expected);
    // });
  });
});
