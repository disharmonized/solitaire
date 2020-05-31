import { Card } from 'src/core';
import {
  CANNOT_TAKE_CARDS_CARDSTACK_IS_EMPTY,
  CANNOT_TAKE_CARDS_NOT_ENOUGH_CARDS,
  CANNOT_TURN_AROUND_CARDS_IN_EMPTY_CARDSTACK,
  CARD_INDEX_DOESNT_EXIST,
  CARD_INDEX_SHOULD_BE_OMITTED,
  MISSING_CARD_INDEX,
  TURN_AROUND_INDEXES_NOT_FOUND,
  TURN_START_INDEX_VALUE_IS_GREATER_OR_EQUALS_END_INDEX_VALUE,
  TURN_TOP_CARDS_AROUND_NUMBER_OF_CARDS_EXCEEDS_CARDS_COUNT,
} from 'src/core/errorMessages';
import { ReverseIterableArrayLike, Util } from 'src/core/util';
import { nonNegativeInteger, notEmptyArrayRest, validCardIndex, validCardIndexesRest, validCardNumberToTake } from 'src/core/validation/parameterValidators';
import { validate } from 'src/core/validation/validateMethod';
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents card stack. Beginning of the stack is the upper card.
 * @example
 * -   <== zero-index card
 * -
 * -
 * === desk
 */
export class CardStack extends ReverseIterableArrayLike<Card> {
  constructor(protected cards: Card[] = [], public readonly alias: string = uuidv4()) {
    super();
  }

  protected getIteratee(): ArrayLike<Card> {
    return this.cards;
  }

  /**
   * Checks if current card stack is empty (contains no cards).
   */
  get isEmpty(): boolean {
    return this.cards.length === 0;
  }

  /**
   * Returns number of card in the card stack.
   */
  get cardCount(): number {
    return this.cards.length;
  }

  /**
   * Checks if card with specified index exists in the card stack.
   * @param {number} cardIndex Card index to check.
   */
  @validate
  cardExists(@validCardIndex cardIndex: number): boolean {
    return !!this.cards[cardIndex];
  }

  /**
   * Returns card in the stack.
   * @param {number} cardIndex index of the card to get.
   */
  @validate
  getCard(@validCardIndex cardIndex: number): Card {
    if (!this.cardExists(cardIndex)) {
      throw new Error(CARD_INDEX_DOESNT_EXIST(cardIndex, this.alias));
    }
    return this.cards[cardIndex];
  }

  /**
   * Adds card stack to current stack.
   * @example
   *
   * -                                \
   * -    \                            \
   * -     new card stack to be added   \
   * -    /                              current cardstack
   * -   <- where to add                /
   * -                                 /
   * -                                /
   * === desk
   * @param {CardStack} cardStack New card stack.
   * @param {number }cardIndex Index of the card in the current stack where to add new stack.
   */
  @validate
  addToMe(cardStack: CardStack, @validCardIndex cardIndex?: number): void {
    if (cardStack.isEmpty) {
      return;
    }
    if (this.isEmpty) {
      if (cardIndex !== void 0) {
        throw new Error(CARD_INDEX_SHOULD_BE_OMITTED(this.alias));
      }
      cardStack.toForwardIterable();
    } else {
      if (cardIndex === void 0) {
        throw new Error(MISSING_CARD_INDEX(this.alias));
      }
      if (!this.cardExists(cardIndex)) {
        throw new Error(CARD_INDEX_DOESNT_EXIST(cardIndex, this.alias));
      }
      cardStack.toReverseIterable();
    }

    for (const cardToAdd of cardStack) {
      if (this.isEmpty) {
        cardIndex = 0;
        this.cards.push(cardToAdd);
      } else {
        this.cards.splice(cardIndex + 1, 0, cardToAdd);
      }
    }
  }

  /**
   * Adds current card stack to the another one.
   * @example
   * -                                \
   * -    \                            \
   * -     current card stack           \
   * -    /                              another cardstack
   * -   <- where to add                /
   * -                                 /
   * -                                /
   * === desk
   * @param {CardStack} cardStack Another card stack.
   * @param {number} cardIndex Index of the card in the another card stack where to add current one.
   */
  addMyselfTo(cardStack: CardStack, @validCardIndex cardIndex?: number): void {
    cardStack.addToMe(this, cardIndex);
  }

  /**
   * Adds card stack on top of the current stack.
   * @example
   * - \
   * -  Card stack to be added
   * - /
   * - \
   * -  Current stack
   * - /
   * === desk
   * @param {CardStack} cardStack Card stack.
   */
  addToMeOnTop(cardStack: CardStack): void {
    if (this.isEmpty) {
      this.addToMe(cardStack);
    } else {
      this.addToMe(cardStack, this.cardCount - 1);
    }
  }

  /**
   * Adds current card stack on top of the other stack.
   * @example
   * - \
   * -  Current stack
   * - /
   * - \
   * -  Card stack to be added to
   * - /
   * === desk
   * @param {CardStack} cardStack Card stack where to add the current one.
   */
  addMyselfOnTop(cardStack: CardStack): void {
    cardStack.addToMeOnTop(this);
  }

  /**
   * Takes card stack from the current stack.
   * -
   * -
   * -  \  first card to take
   * -  .. n cards
   * -  /
   * -
   * === desk
   * @param {number} firstCardIndex Index of the first card in the current stack to be taken.
   * @param {number} numberOfCardsToTake Number of cards to take.
   */
  @validate
  take(@validCardIndex firstCardIndex: number, @validCardNumberToTake numberOfCardsToTake: number): CardStack {
    if (this.isEmpty) {
      throw new Error(CANNOT_TAKE_CARDS_CARDSTACK_IS_EMPTY(this.alias));
    }

    if (numberOfCardsToTake > this.cardCount - firstCardIndex) {
      throw new Error(CANNOT_TAKE_CARDS_NOT_ENOUGH_CARDS(numberOfCardsToTake, this.cardCount - firstCardIndex, this.alias));
    }

    const cardsToTake = this.cards.splice(firstCardIndex, numberOfCardsToTake);
    return new CardStack(cardsToTake);
  }

  /**
   * Takes card stack from the top of the current stack.
   * -  \
   * -  .. n cards
   * -  /
   * -
   * === desk
   * @param {number} numberOfCardsToTake Number of cards to take.
   */
  @validate
  takeTop(@validCardNumberToTake numberOfCardsToTake: number): CardStack {
    if (numberOfCardsToTake > this.cardCount) {
      throw new Error(CANNOT_TAKE_CARDS_NOT_ENOUGH_CARDS(numberOfCardsToTake, this.cardCount, this.alias));
    }
    return this.take(this.cardCount - numberOfCardsToTake, numberOfCardsToTake);
  }

  /**
   * Turns cards around.
   * @param {...number[]} cardsIndexes Indexes of cards to turn around.
   */
  @validate
  turnCardsAround(@validCardIndexesRest @notEmptyArrayRest ...cardsIndexes: number[]): void {
    if (this.isEmpty) {
      throw new Error(CANNOT_TURN_AROUND_CARDS_IN_EMPTY_CARDSTACK());
    }
    const dedupedAndSortedIndexes = Array.from(new Set(cardsIndexes)).sort();
    const notFoundIndexes = dedupedAndSortedIndexes.filter(cardIndex => !Object.prototype.hasOwnProperty.call(this.cards, cardIndex)).sort();
    if (notFoundIndexes.length > 0) {
      throw new Error(TURN_AROUND_INDEXES_NOT_FOUND(notFoundIndexes));
    }

    for (const cardIndex of dedupedAndSortedIndexes) {
      this.cards[cardIndex].turnAround();
    }
  }

  /**
   * Turns card range around.
   * @param {number} startIndex Start card index.
   * @param {number} endIndex End card index, non-inclusive.
   */
  @validate
  turnCardRangeAround(@validCardIndex startIndex: number, @validCardIndex endIndex: number): void {
    if (startIndex > endIndex - 1) {
      throw new Error(TURN_START_INDEX_VALUE_IS_GREATER_OR_EQUALS_END_INDEX_VALUE(startIndex, endIndex));
    }
    if (startIndex === endIndex - 1) {
      this.turnCardsAround(startIndex);
    } else {
      this.turnCardsAround(...Util.range({ start: startIndex, end: endIndex }));
    }
  }

  /**
   * Turns top cards around.
   *  @param {number} numberOfCards Number of top cards to turn around.
   */
  @validate
  turnTopCardsAround(@nonNegativeInteger numberOfCards: number): void {
    if (this.isEmpty) {
      throw new Error(CANNOT_TURN_AROUND_CARDS_IN_EMPTY_CARDSTACK());
    }
    if (numberOfCards > this.cardCount) {
      throw new Error(TURN_TOP_CARDS_AROUND_NUMBER_OF_CARDS_EXCEEDS_CARDS_COUNT(numberOfCards, this.cardCount));
    }
    const cardIndexes = Util.range(numberOfCards);
    this.turnCardsAround(...cardIndexes);
  }

  /**
   * Turns top card around.
   */
  turnTopCardAround(): void {
    this.turnCardsAround(0);
  }

  /**
   * Sorts cards.
   * @param {(a: Card, b: Card) => -1 | 1 | 0} compare Compare function. Works the same as for Array.prototype.sort().
   */
  sort(compare: (a: Card, b: Card) => -1 | 1 | 0): void {
    this.cards.sort(compare);
  }
}
