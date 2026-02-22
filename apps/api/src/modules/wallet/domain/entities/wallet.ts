import { WalletType } from '@pawpal/shared';

export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly balance: any, // Expecting Decimal type compatibility (has .plus, .minus, .greaterThanOrEqualTo, etc.)
    public readonly walletType: WalletType | string,
  ) {}

  // Since we abstracted the data mapper out of the Entity, we don't put repository
  // injection explicitly in the pure domain entity constructor logic anymore.
  // Value operations (like balance comparisons) can sit here if required.

  /**
   * Calculates the missing amount to reach a required threshold.
   */
  public calculateMissingAmount(requiredAmount: any): any {
    if (!this.balance) return requiredAmount;

    // Assuming Decimal interface presence
    if (this.balance.greaterThanOrEqualTo(requiredAmount)) {
      // Return 0 matching the prototype of whatever number/decimal library is passed.
      // Easiest is to return 0 and cast out mapping upstream, or rely on Decimal parsing.
      // Usually, it's safer to just return zero using the same library constructor if we knew it,
      // but subtraction yielding 0 is pure.
      return requiredAmount.minus(requiredAmount);
    }

    return requiredAmount.minus(this.balance);
  }
}
