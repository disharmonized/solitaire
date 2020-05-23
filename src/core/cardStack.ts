import { Card } from 'src/core';
import { validate } from 'src/core/validation/validateMethod';
import { validCardIndex, validCardNumberToTake, validCardIndexesRest, notEmptyArrayRest, nonNegativeInteger } from 'src/core/validation/parameterValidators';
import { v4 as uuidv4 } from 'uuid';
import {
  CARD_INDEX_DOESNT_EXIST,
  MISSING_CARD_INDEX,
  CARD_INDEX_SHOULD_BE_OMITTED,
  CANNOT_TAKE_CARDS_CARDSTACK_IS_EMPTY,
  CANNOT_TAKE_CARDS_NOT_ENOUGH_CARDS,
  CANNOT_TURN_AROUND_CARDS_IN_EMPTY_CARDSTACK,
  TURN_AROUND_INDEXES_NOT_FOUND,
  TURN_TOP_CARDS_AROUND_NUMBER_OF_CARDS_EXCEEDS_CARDS_COUNT,
  TURN_START_INDEX_VALUE_IS_GREATER_OR_EQUALS_END_INDEX_VALUE,
} from 'src/core/errorMessages';
import { ReverseIterableArrayLike, Util } from 'src/core/util';

/**
 * Card stack class. Beginning of the stack is the upper card.
 * -  <== zero-index card
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
   * Checks if current card stack is empty (contains no cards)
   */
  get isEmpty(): boolean {
    return this.cards.length === 0;
  }

  /**
   * Gets number of card in the card stack
   */
  get cardCount(): number {
    return this.cards.length;
  }

  @validate
  cardExists(@validCardIndex cardIndex: number): boolean {
    return !!this.cards[cardIndex];
  }

  /**
   * Returns card in the stack.
   * @param cardIndex index of the card to get.
   */
  @validate
  getCard(@validCardIndex cardIndex: number): Card {
    if (!this.cardExists(cardIndex)) {
      throw new Error(CARD_INDEX_DOESNT_EXIST(cardIndex, this.alias));
    }
    return this.cards[cardIndex];
  }

  /**
   * Add card stack to current stack
   *
   * -                                \
   * -    \                            \
   * -     new card stack to be added   \
   * -    /                              current cardstack
   * -   <- where to add                /
   * -                                 /
   * -                                /
   * === desk
   * @param cardIndex Index of the card in the current stack where to add new stack
   * @param cardStack New card stack
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
   * Add current card stack to another one
   *
   * -                                \
   * -    \                            \
   * -     current card stack           \
   * -    /                              another cardstack
   * -   <- where to add                /
   * -                                 /
   * -                                /
   * === desk
   * @param cardIndex Index of the card in the current stack where to add new stack
   * @param cardStack Another card stack
   */
  addMyselfTo(cardStack: CardStack, @validCardIndex cardIndex?: number): void {
    cardStack.addToMe(this, cardIndex);
  }

  /**
   * Adds card stack on top of the current stack
   *
   * - \
   * -  Card stack to be added
   * - /
   * - \
   * -  Current stack
   * - /
   * === desk
   * @param cardIndex Index of the card in the current stack where to add new stack
   * @param cardStack Card stack
   */
  addToMeOnTop(cardStack: CardStack): void {
    if (this.isEmpty) {
      this.addToMe(cardStack);
    } else {
      this.addToMe(cardStack, this.cardCount - 1);
    }
  }

  /**
   * Adds current card stack on top of the other stack
   *
   * - \
   * -  Current stack
   * - /
   * - \
   * -  Card stack to be added to
   * - /
   * === desk
   * @param cardStack Card stack
   */
  addMyselfOnTop(cardStack: CardStack): void {
    cardStack.addToMeOnTop(this);
  }

  /**
   * Takes card stack from the current stack
   * -
   * -
   * -  \  first card to take
   * -  .. n cards
   * -  /
   * -
   * === desk
   * @param firstCardIndex Index of the first card in the current stack
   * @param numberOfCardsToTake Number of cards to take
   * @returns {CardStack}
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
   * Takes card stack from the top of the current stack
   * -  \
   * -  .. n cards
   * -  /
   * -
   * === desk
   * @param numberOfCardsToTake Number of cards to take
   */
  @validate
  takeTop(@validCardNumberToTake numberOfCardsToTake): CardStack {
    if (numberOfCardsToTake > this.cardCount) {
      throw new Error(CANNOT_TAKE_CARDS_NOT_ENOUGH_CARDS(numberOfCardsToTake, this.cardCount, this.alias));
    }
    return this.take(this.cardCount - numberOfCardsToTake, numberOfCardsToTake);
  }

  /**
   * Turns cards around
   * @param {...number[]} cardsIndexes indexes of cards
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
   * Turns card range around
   * @param {number} startIndex start card index
   * @param {number} endIndex end card index, non-inclusive
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
   * Turns top cards around
   *  @param numberOfCards number of top cards to turn around
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
   * Turns top card around
   */
  turnTopCardAround(): void {
    this.turnCardsAround(0);
  }
}
