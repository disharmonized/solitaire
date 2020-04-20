import * as assert from 'assert';
import { Suit, SpecialRank } from 'core';
import { createQueenOfSpades } from './testUtils/cardUtil';

describe('Card', function() {
  let card;
  beforeEach(function() {
    card = createQueenOfSpades();
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
  describe('#roll()', function() {
    it('should roll the card correctly', function() {
      card.roll();
      assert.equal(card.isFacedUp, true);
    });
  });
});
