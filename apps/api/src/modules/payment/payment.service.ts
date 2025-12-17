import { TransactionEntity } from '@/common/entities/transaction.entity';
import {
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@/generated/prisma/enums';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';
import generatePayload from 'promptpay-qr';
import { EventService } from '../event/event.service';
import { PaymentGatewayService } from '../payment-gateway/payment-gateway.service';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepository } from '../transaction/transaction.repository';
import { WalletRepository } from '../wallet/wallet.repository';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly eventService: EventService,
    private readonly walletRepo: WalletRepository,
  ) {}

  async topup(
    user: Session,
    amount: Decimal,
    paymentId: string,
    orderId?: string,
  ) {
    const isActive = await this.paymentGatewayService.isActive(paymentId);
    if (!isActive) throw new BadGatewayException(`${paymentId} is not active`);

    switch (paymentId) {
      case 'promptpay-manual':
        return this.createPromptpayManualCharge(user, amount, orderId);
      default:
        this.logger.error(
          `Payment method ${paymentId} is not supported. Falling back to default.`,
        );
        throw new BadGatewayException(
          `Payment method ${paymentId} is not supported.`,
        );
    }
  }

  /**
   * Create charge
   * @param userId user id
   * @param amount amount to charge
   * @param paymentGatewayId payment gateway id
   * @param orderId order id (optional)
   * @param status transaction status (default: CREATED)
   * @param walletType wallet type (default: MAIN)
   * @returns created charge
   */
  public async createCharge(
    userId: string,
    amount: Decimal,
    paymentGatewayId: string,
    orderId?: string,
    status: TransactionStatus = TransactionStatus.CREATED,
    walletType: WalletType = WalletType.MAIN,
  ) {
    const type = orderId
      ? TransactionType.TOPUP_FOR_PURCHASE
      : TransactionType.TOPUP;

    const wallet = await this.walletRepo.find(userId, walletType);
    const charge = await this.prisma.userWalletTransaction.create({
      data: {
        type,
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
        payment: {
          connect: {
            id: paymentGatewayId,
          },
        },
        balance_before: wallet.balance,
        balance_after: wallet.balance.plus(amount),
        status,
        ...(orderId && { order: { connect: { id: orderId } } }),
      },
      select: {
        id: true,
        type: true,
        amount: true,
        status: true,
        order_id: true,
        payment: {
          select: {
            id: true,
            metadata: true,
          },
        },
        createdAt: true,
      },
    });

    return charge;
  }

  async confirm(chargeId: string) {
    const charge = await this.prisma.userWalletTransaction.update({
      where: {
        id: chargeId,
        status: TransactionStatus.CREATED,
      },
      data: {
        status: TransactionStatus.PENDING,
      },
      select: TransactionRepository.DEFAULT_SELECT,
    });

    const result = TransactionEntity.toJson(charge);

    this.eventService.admin.onNewJobTransaction(result);
    return result;
  }

  private async createPromptpayManualCharge(
    user: Session,
    amount: Decimal,
    orderId?: string,
  ) {
    const gateway =
      await this.paymentGatewayService.getGateway('promptpay-manual');

    const metadata = gateway.metadata as { name?: string; number?: string };

    if (!metadata) throw new BadGatewayException('Metadata not found');
    if (!metadata.number) throw new BadGatewayException('Metadata not found');
    if (!metadata.name) throw new BadGatewayException('Metadata not found');

    const wallet = await this.walletRepo.find(user.id);
    const charge = await this.createCharge(
      user.id,
      amount,
      gateway.id,
      orderId,
      TransactionStatus.CREATED,
      wallet.walletType,
    );

    return {
      ...charge,
      qrcode: generatePayload(metadata.number, {
        amount: amount.toNumber(),
      }),
    };
  }
}
