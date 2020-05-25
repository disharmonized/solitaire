import * as assert from 'assert';
import { CardStack } from 'src/core';
import { SpecialRank, StandardSuit } from 'src/core/standard';
import { addTest } from 'test/core/cardStack.add.test';
import { takeTest } from 'test/core/cardStack.take.test';
import { turnAroundTest } from 'test/core/cardStack.turnAround.test';
import { blackQueenOfSpades } from 'testUtils/src/cardUtil';

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
      assert.equal(card.suit, StandardSuit.SPADES);
    });
    it("should throw error if card doesn't exist", function() {
      const cardStack = new CardStack([blackQueenOfSpades()]);
      const block = (): void => {
        cardStack.getCard(5);
      };
      assert.throws(block, { message: `Card with index 5 doesn't exist in card stack ${cardStack.alias}` });
    });
  });

  context('manipulate with cardStack', function() {
    addTest();
    takeTest();
    turnAroundTest();
  });
});
