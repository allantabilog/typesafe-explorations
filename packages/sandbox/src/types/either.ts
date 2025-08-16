export class Either<TLeft, TRight> {
  private readonly value: TLeft | TRight;
  private readonly left: boolean;

  constructor(value: TLeft | TRight, left: boolean) {
    this.value = value;
    this.left = left;
  }

  isLeft(): boolean {
    return this.left;
  }

  getLeft(): TLeft {
    if (!this.isLeft()) throw new Error();
    return this.value as TLeft;
  }

  isRight(): boolean {
    return !this.isLeft;
  }

  getRight(): TRight {
    if (!this.isRight()) throw new Error();
    return this.value as TRight;
  }

  static makeLeft<TLeft, TRight>(value: TLeft) {
    return new Either<TLeft, TRight>(value, true);
  }

  static makeRight<TLeft, TRight>(value: TRight) {
    return new Either<TLeft, TRight>(value, false);
  }
}
