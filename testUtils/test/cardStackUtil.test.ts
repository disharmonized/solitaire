import * as assert from 'assert';
import { Card, CardStack, RankValueBounds, SpecialRank, Suit } from 'src/core';
import { cardsAreEqual, cardStackToStringArray, cardToString, parseCardFromString, stringCardsArrayToCardStack } from 'testUtils/src/cardStackUtil';
import { blackQueenOfSpades, SimpleCardColors } from 'testUtils/src/cardUtil';

describe('testUtils', function() {
  describe('CardStackUtil', function() {
    describe('#parseCardFromString()', function() {
      it('should correctly parse card from string', function() {
        const cardString = '100';
        const card = parseCardFromString(cardString);
        assert.equal(card.suit, Suit.DIAMONDS);
        assert.equal(card.rank, SpecialRank.ACE);
        assert.equal(card.color, SimpleCardColors.Black);
      });
      it('should throw error if suit in invalid', function() {
        const cardString = '190';
        assert.throws(() => parseCardFromString(cardString), { message: "Invalid suit 9: it doesn't exist in Suit type" });
      });
      it('should throw error if rank in invalid', function() {
        const cardString = 'F00';
        assert.throws(() => parseCardFromString(cardString), {
          message: `Invalid rank value 15: should be >= ${RankValueBounds.START_VALUE} and <= ${RankValueBounds.END_VALUE}`,
        });
      });
      it('should throw error if string card length is not equal 3', function() {
        const cardString = '10123';
        assert.throws(() => parseCardFromString(cardString), { message: 'Invalid stringCard.length 5: length should be 3' });
      });
    });
    describe('#cardToString()', function() {
      it('should correctly serialize card to string', function() {
        const card = blackQueenOfSpades();
        const stringCard = cardToString(card);
        assert.equal(stringCard, 'c30');
      });
    });
    describe('#stringCardsArrayToCardStack()', function() {
      it('should correctly deserialize array of strings to card stack', function() {
        const cards = ['100', 'A31', '822'];
        const stack = stringCardsArrayToCardStack(cards);
        assert.equal(stack.cardCount, 3);
        assert.equal(stack.getCard(0).rank, 1);
        assert.equal(stack.getCard(0).suit, Suit.DIAMONDS);
        assert.equal(stack.getCard(0).color, SimpleCardColors.Black);
        assert.equal(stack.getCard(1).rank, 10);
        assert.equal(stack.getCard(1).suit, Suit.SPADES);
        assert.equal(stack.getCard(1).color, SimpleCardColors.Red);
        assert.equal(stack.getCard(2).rank, 8);
        assert.equal(stack.getCard(2).suit, Suit.HEARTS);
        assert.equal(stack.getCard(2).color, SimpleCardColors.Blue);
      });
    });
    describe('#cardsAreEqual()', function() {
      it('should return correct result for string and object', function() {
        assert.equal(cardsAreEqual('A00', new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black)), true);
        assert.equal(cardsAreEqual('a00', new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black)), true);
        assert.equal(cardsAreEqual('c30', blackQueenOfSpades()), true);
        assert.equal(cardsAreEqual('A00', new Card(Suit.DIAMONDS, 11, SimpleCardColors.Black)), false);
        assert.equal(cardsAreEqual('C40', blackQueenOfSpades()), false);
      });
      it('should return correct result for string and string', function() {
        assert.equal(cardsAreEqual('A00', 'A00'), true);
        assert.equal(cardsAreEqual('A00', 'a00'), true);
        assert.equal(cardsAreEqual('A00', 'c30'), false);
      });
      it('should return correct result for object and object', function() {
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black), new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black)), true);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 11, SimpleCardColors.Black), new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black)), false);
        assert.equal(
          cardsAreEqual(new Card(Suit.DIAMONDS, SpecialRank.ACE, SimpleCardColors.Black), new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black)),
          false,
        );
      });
      it('should return correct result for object and string', function() {
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black), 'A00'), true);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 10, SimpleCardColors.Black), 'a00'), true);
        assert.equal(cardsAreEqual(blackQueenOfSpades(), 'c30'), true);
        assert.equal(cardsAreEqual(new Card(Suit.DIAMONDS, 11, SimpleCardColors.Black), 'A00'), false);
        assert.equal(cardsAreEqual(blackQueenOfSpades(), 'C40'), false);
      });
    });
    describe('#cardStackToStringArray()', function() {
      it('should correctly serialize card stack to array of strings', function() {
        const cardStack = new CardStack([
          new Card(Suit.DIAMONDS, 1, SimpleCardColors.Black),
          new Card(Suit.SPADES, 10, SimpleCardColors.Black),
          new Card(Suit.HEARTS, 8, SimpleCardColors.Black),
        ]);
        const cards = ['100', 'a30', '820'];
        assert.deepEqual(cardStackToStringArray(cardStack), cards);
      });
    });
  });
});
