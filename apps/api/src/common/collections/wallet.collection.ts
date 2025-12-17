import { BaseCollection } from '@/common/classes/BaseCollection';
import { WalletType } from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';
import { WalletEntity } from '../entities/wallet.entity';

export class WalletCollection extends BaseCollection<WalletEntity> {
  toObject() {
    return this.items.reduce(
      (acc, wallet) => {
        acc[wallet.walletType] = wallet.balance;
        return acc;
      },
      {} as Record<WalletType, Decimal>,
    );
  }
}
