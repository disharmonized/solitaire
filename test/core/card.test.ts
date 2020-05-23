import * as assert from 'assert';
import { Card, SpecialRank, Suit } from 'src/core';
import { blackQueenOfSpades, SimpleCardColors } from 'testUtils/src/cardUtil';

describe('Card', function() {
  let card: Card;
  beforeEach(function() {
    card = blackQueenOfSpades();
  });
  describe('#isFacedUp()', function() {
    it('should return correct value', function() {
      assert.equal(card.isFacedUp, false);
    });
  });
  describe('#rank()', function() {
    it('should return correct value', function() {
      assert.equal(card.rank, SpecialRank.QUENN);
    });
  });
  describe('#suit()', function() {
    it('should return correct value', function() {
      assert.equal(card.suit, Suit.SPADES);
    });
  });
  describe('#color()', function() {
    it('should return correct value', function() {
      assert.equal(card.color, SimpleCardColors.Black);
    });
  });
  describe('#turnAround()', function() {
    it('should roturn around the card correctly', function() {
      card.turnAround();
      assert.equal(card.isFacedUp, true);
    });
  });
});
