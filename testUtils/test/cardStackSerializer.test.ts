import * as assert from 'assert';
import { Card, CardStack } from 'src/core';
import { SpecialRank, StandardRanks, StandardSuit } from 'src/core/standard';
import { CardStackSerializer } from 'testUtils/src/cardStackSerializer';
import { blackQueenOfSpades, SimpleCardColors } from 'testUtils/src/cardUtil';

describe('CardStackSerializer', function() {
  describe('#parseCardFromString()', function() {
    context('isFacedUpIncluded = false', function() {
      let serializer: CardStackSerializer;

      beforeEach(function() {
        serializer = new CardStackSerializer({ isFacedUpIncluded: false });
      });
      it('should correctly parse card from string', function() {
        const cardString = '100';
        const card = serializer.parseCardFromString(cardString);
        assert.equal(card.suit, StandardSuit.DIAMONDS);
        assert.equal(card.rank, SpecialRank.ACE);
        assert.equal(card.color, SimpleCardColors.Black);
      });
      it('should throw error if suit in invalid', function() {
        const cardString = '190';
        assert.throws(() => serializer.parseCardFromString(cardString), { message: "Invalid suit 9: it doesn't exist in StandardSuit type" });
      });
      it('should throw error if rank in invalid', function() {
        const cardString = 'F00';
        assert.throws(() => serializer.parseCardFromString(cardString), {
          message: `Invalid rank value 15: should be one of [${StandardRanks.join(',')}]`,
        });
      });
      it('should throw error if string card length is not equal 3', function() {
        const cardString = '10123';
        assert.throws(() => serializer.parseCardFromString(cardString), { message: 'Invalid stringCard.length 5: length should be 3' });
      });
    });
    context('isFacedUpIncluded = true', function() {
      let serializer: CardStackSerializer;

      beforeEach(function() {
        serializer = new CardStackSerializer({ isFacedUpIncluded: true });
      });
      it('should throw error if string card length is not equal 4', function() {
        const cardString = '10123';
        assert.throws(() => serializer.parseCardFromString(cardString), { message: 'Invalid stringCard.length 5: length should be 4' });
      });
      it('should throw error if string isFacedUp value is invalid', function() {
        const cardString = '101*';
        assert.throws(() => serializer.parseCardFromString(cardString), { message: 'Cannot parse isFacedUp value *: should be either + or -' });
      });
      it('should correctly parse card from string if string isFacedUp value is +', function() {
        const cardString = '100+';
        const card = serializer.parseCardFromString(cardString);
        assert.equal(card.suit, StandardSuit.DIAMONDS);
        assert.equal(card.rank, SpecialRank.ACE);
        assert.equal(card.color, SimpleCardColors.Black);
        assert.equal(card.isFacedUp, true);
      });
      it('should correctly parse card from string if string isFacedUp value is -', function() {
        const cardString = '100-';
        const card = serializer.parseCardFromString(cardString);
        assert.equal(card.suit, StandardSuit.DIAMONDS);
        assert.equal(card.rank, SpecialRank.ACE);
        assert.equal(card.color, SimpleCardColors.Black);
        assert.equal(card.isFacedUp, false);
      });
    });
  });
  describe('#cardToString()', function() {
    context('isFacedUpIncluded = false', function() {
      let serializer: CardStackSerializer;

      beforeEach(function() {
        serializer = new CardStackSerializer({ isFacedUpIncluded: false });
      });
      it('should correctly serialize card to string', function() {
        const card = blackQueenOfSpades();
        const stringCard = serializer.cardToString(card);
        assert.equal(stringCard, 'c30');
      });
    });
    context('isFacedUpIncluded = true', function() {
      let serializer: CardStackSerializer;
      beforeEach(function() {
        serializer = new CardStackSerializer({ isFacedUpIncluded: true });
      });
      it('should correctly serialize card to string if string isFacedUp value is +', function() {
        const card = blackQueenOfSpades();
        card.turnAround();
        const stringCard = serializer.cardToString(card);
        assert.equal(stringCard, 'c30+');
      });
      it('should correctly serialize card to string if string isFacedUp value is -', function() {
        const card = blackQueenOfSpades();
        const stringCard = serializer.cardToString(card);
        assert.equal(stringCard, 'c30-');
      });
    });
  });
  describe('#stringCardsArrayToCardStack()', function() {
    let serializer: CardStackSerializer;

    beforeEach(function() {
      serializer = new CardStackSerializer({ isFacedUpIncluded: false });
    });
    it('should correctly deserialize array of strings to card stack', function() {
      const cards = ['100', 'A31', '822'];
      const stack = serializer.stringCardsArrayToCardStack(cards);
      assert.equal(stack.cardCount, 3);
      assert.equal(stack.getCard(0).rank, 1);
      assert.equal(stack.getCard(0).suit, StandardSuit.DIAMONDS);
      assert.equal(stack.getCard(0).color, SimpleCardColors.Black);
      assert.equal(stack.getCard(1).rank, 10);
      assert.equal(stack.getCard(1).suit, StandardSuit.SPADES);
      assert.equal(stack.getCard(1).color, SimpleCardColors.Red);
      assert.equal(stack.getCard(2).rank, 8);
      assert.equal(stack.getCard(2).suit, StandardSuit.HEARTS);
      assert.equal(stack.getCard(2).color, SimpleCardColors.Blue);
    });
  });
  describe('#cardsAreEqual()', function() {
    let serializer: CardStackSerializer;

    beforeEach(function() {
      serializer = new CardStackSerializer({ isFacedUpIncluded: false });
    });
    it('should return correct result for string and object', function() {
      assert.equal(serializer.cardsAreEqual('A00', new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black)), true);
      assert.equal(serializer.cardsAreEqual('a00', new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black)), true);
      assert.equal(serializer.cardsAreEqual('c30', blackQueenOfSpades()), true);
      assert.equal(serializer.cardsAreEqual('A00', new Card(StandardSuit.DIAMONDS, 11, SimpleCardColors.Black)), false);
      assert.equal(serializer.cardsAreEqual('C40', blackQueenOfSpades()), false);
    });
    it('should return correct result for string and string', function() {
      assert.equal(serializer.cardsAreEqual('A00', 'A00'), true);
      assert.equal(serializer.cardsAreEqual('A00', 'a00'), true);
      assert.equal(serializer.cardsAreEqual('A00', 'c30'), false);
    });
    it('should return correct result for object and object', function() {
      assert.equal(
        serializer.cardsAreEqual(new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black), new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black)),
        true,
      );
      assert.equal(
        serializer.cardsAreEqual(new Card(StandardSuit.DIAMONDS, 11, SimpleCardColors.Black), new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black)),
        false,
      );
      assert.equal(
        serializer.cardsAreEqual(
          new Card(StandardSuit.DIAMONDS, SpecialRank.ACE, SimpleCardColors.Black),
          new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black),
        ),
        false,
      );
    });
    it('should return correct result for object and string', function() {
      assert.equal(serializer.cardsAreEqual(new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black), 'A00'), true);
      assert.equal(serializer.cardsAreEqual(new Card(StandardSuit.DIAMONDS, 10, SimpleCardColors.Black), 'a00'), true);
      assert.equal(serializer.cardsAreEqual(blackQueenOfSpades(), 'c30'), true);
      assert.equal(serializer.cardsAreEqual(new Card(StandardSuit.DIAMONDS, 11, SimpleCardColors.Black), 'A00'), false);
      assert.equal(serializer.cardsAreEqual(blackQueenOfSpades(), 'C40'), false);
    });
  });
  describe('#cardStackToStringArray()', function() {
    let serializer: CardStackSerializer;

    beforeEach(function() {
      serializer = new CardStackSerializer({ isFacedUpIncluded: false });
    });
    it('should correctly serialize card stack to array of strings', function() {
      const cardStack = new CardStack([
        new Card(StandardSuit.DIAMONDS, 1, SimpleCardColors.Black),
        new Card(StandardSuit.SPADES, 10, SimpleCardColors.Black),
        new Card(StandardSuit.HEARTS, 8, SimpleCardColors.Black),
      ]);
      const cards = ['100', 'a30', '820'];
      assert.deepEqual(serializer.cardStackToStringArray(cardStack), cards);
    });
  });
});
