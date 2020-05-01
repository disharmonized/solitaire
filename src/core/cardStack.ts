import { Card } from 'src/core';
import { validate } from 'src/core/validation/validateMethod';
import { validCardIndex } from 'src/core/validation/parameterValidators';
import { v4 as uuidv4 } from 'uuid';
import { CARD_INDEX_DOESNT_EXIST, MISSING_CARD_INDEX, CARD_INDEX_SHOULD_BE_OMITTED } from 'src/core/errorMessages';
import { ReverseIterableArrayLike } from 'src/core/util';

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
   * Takes card stack from the top of the current stack
   * -
   * -
   * -  \  first card to take
   * -  .. n cards
   * -  /
   * -
   * === desk
   * @param firstCardIndex Index of the first card in the current stack
   * @param numberOfCardsToTake N cards to take
   */

  // takeCardStask(
  //   firstCardIndex: number,
  //   numberOfCardsToTake: number,
  // ): CardStack {}

  /**
   * Add card stack to current stack
   *
   * - \
   * -  new card stack to be added
   * - /
   * === desk
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
   * Takes card stack from the top of the current stack
   * -  \
   * -  .. n cards
   * -  /
   * -
   * === desk
   * @param numberOfCardsToTake n cards to take
   */
  // takeTopCardStack(numberOfCardsToTake): CardStack {
  //   return this.takeCardStask(0, numberOfCardsToTake);
  // }

  /**
   * Add card stack on top of the current stack
   *
   * - \
   * -  new card stack to be added
   * - /
   * - \
   * -  Current stack
   * - /
   * === desk
   * @param cardIndex Index of the card in the current stack where to add new stack
   * @param cardStack New card stack
   */
  // addCardStackOnTop(cardStack: CardStack): void {
  //   this.addCardStack(cardStack, 0);
  // }

  /**
   * Turns cards around in the stack
   * @param cardsIndexes Indexes of cards to turn around
   */
  // turnCardsAround(...cardsIndexes: number[]): void {}

  /**
   * Turns top card around
   */
  // turnTopCardAround(): void {
  //   this.turnCardsAround(0);
  // }

  /**
   * Turns top cards around
   *  @param numberOfCards number of top cards to turn around
   */
  // turnTopCardsAround(numberOfCards: number): void {
  //   const cardIndexes = createArrayOfSeqIndexes(numberOfCards);
  //   this.turnCardsAround(...cardIndexes);
  // }

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
}
