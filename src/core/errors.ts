export class Errors {
  static INVALID_CARD_INDEX(value: number): string {
    return `Invalid card index ${value}: should be non-negative integer`;
  }
}
