import * as assert from 'assert';
import { CardStack } from 'core';
import { createQueenOfSpades } from './_testUtils/cardUtil';

describe('CardStack', function() {
  describe('##isEmpty()', function() {
    it('should return true is card stack is empty', function() {
      const cardStack = new CardStack();
      assert.equal(cardStack.isEmpty, true);
    });
    it('should return false is card stack is not empty', function() {
      const cardStack = new CardStack([createQueenOfSpades()]);
      assert.equal(cardStack.isEmpty, false);
    });
  });
});
