import * as assert from 'assert';
import { parseCardFromString, cardToString, stringCardsArrayToCardStack, cardsAreEqual, cardStackToStringArray } from 'testUtils/src/cardStackUtil';
import { Suit, SpecialRank, RankValueBounds, Card, CardStack } from 'src/core';
import { queenOfSpades } from 'testUtils/src/cardUtil';

describe('testUtils', function() {
  describe('CardStackUtil', function() {
    describe('#parseCardFromString()', function() {
      it('should correctly parse card from string', function() {
        const cardString = '10';
        const card = parseCardFromString(cardString);
        assert.equal(card.suit, Suit.DIAMONDS);
        assert.equal(card.rank, SpecialRank.ACE);
      });
      it('should throw error if suit in invalid', function() {
        const cardString = '19';
        assert.throws(() => parseCardFromString(cardString), { message: "Invalid suit 9: it doesn't exist in Suit type" });
      });
      it('should throw error if rank in invalid', function() {
        const cardString = 'F0';
        assert.throws(() => parseCardFromString(cardString), {
          message: `Invalid rank value 15: should be >= ${RankValueBounds.START_VALUE} and <= ${RankValueBounds.END_VALUE}`,
        });
      });
      it('should throw error if string card length is not equal 2', function() {
        const cardString = '10123';
        assert.throws(() => parseCardFromString(cardString), { message: 'Invalid stringCard.length 5: length should be 2' });
      });
    });
    describe('#cardToString()', function() {
      it('should correctly serialize card to string', function() {
        const card = queenOfSpades();
        const stringCard = cardToString(card);
        assert.equal(stringCard, 'c3');
      });
    });
    describe('#stringCardsArrayToCardStack()', function() {
      it('should correctly deserialize array of strings to card stack', function() {
        const cards = ['10', 'A3', '82'];
        const stack = stringCardsArrayToCardStack(cards);
        assert.equal(stack.cardCount, 3);
        assert.equal(stack.getCard(0).rank, 1);
        assert.equal(stack.getCard(0).suit, Suit.DIAMONDS);
        assert.equal(stack.getCard(1).rank, 10);
        assert.equal(stack.getCard(1).suit, Suit.SPADES);
        assert.equal(stack.getCard(2).rank, 8);
        assert.equal(stack.getCard(2).suit, Suit.HEARTS);
      });
    });
    describe('#cardsAreEqual()', function() {
      it('should return correct result for string and object', function() {
        assert.equal(cardsAreEqual('A0', new Card(Suit.DIAMONDS, 10)), true);
        assert.equal(cardsAreEqual('a0', new Card(Suit.DIAMONDS, 10)), true);
        assert.equal(cardsAreEqual('c3', queenOfSpades()), true);
        assert.equal(cardsAreEqual('A0', new Card(Suit.DIAMONDS, 11)), false);
        assert.equal(cardsAreEqual('C4', queenOfSpades()), false);
      });
      it('should return correct result for string and string', function() {
        assert.equal(cardsAreEqual('A0', 'A0'), true);
        assert.equal(cardsAreEqual('A0', 'a0'), true);
        assert.equal(cardsAreEqual('A0', 'c3'), false);
      });
      it('should return correct result for object and object', function() {
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 10), new Card(Suit.DIAMONDS, 10)), true);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 11), new Card(Suit.DIAMONDS, 10)), false);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, SpecialRank.ACE), new Card(Suit.DIAMONDS, 10)), false);
      });
      it('should return correct result for object and string', function() {
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 10), 'A0'), true);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 10), 'a0'), true);
        assert.equal(cardsAreEqual(queenOfSpades(), 'c3'), true);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 11), 'A0'), false);
        assert.equal(cardsAreEqual(queenOfSpades(), 'C4'), false);
      });
    });
    describe('#cardStackToStringArray()', function() {
      it('should correctly serialize card stack to array of strings', function() {
        const cardStack = new CardStack([new Card(Suit.DIAMONDS, 1), new Card(Suit.SPADES, 10), new Card(Suit.HEARTS, 8)]);
        const cards = ['10', 'a3', '82'];
        assert.deepEqual(cardStackToStringArray(cardStack), cards);
      });
    });
  });
});
