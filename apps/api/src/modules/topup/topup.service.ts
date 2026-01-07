import { TopupResponseMapper } from '@/common/mappers/TopupResponseMapper';
import { TransactionResponseMapper } from '@/common/mappers/TransactionResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import {
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@/generated/prisma/enums';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ENUM_TOPUP_STATUS, Session, TopupStatus } from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';
import generatePayload from 'promptpay-qr';
import { EventService } from '../event/event.service';
import { PaymentGatewayService } from '../payment-gateway/payment-gateway.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from '../wallet/wallet.repository';

@Injectable()
export class TopupService {
  private readonly logger = new Logger(TopupService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly eventService: EventService,
    private readonly walletRepo: WalletRepository,
  ) {}

  /**
   * Get user wallet transaction history
   * @param user_id user id
   * @returns user wallet transaction history
   */
  public async getTopupHistoryDatatable(
    user_id: string,
    query: DatatableQuery,
  ) {
    const where: Prisma.UserWalletTransactionWhereInput = {
      wallet: {
        user_id,
      },
      order_id: null,
    };

    if (
      query.filter &&
      Object.values(ENUM_TOPUP_STATUS).includes(query.filter)
    ) {
      where.status = query.filter as TopupStatus;
    }

    const datatable = await this.prisma.userWalletTransaction.getDatatable({
      query,
      where,
      select: TopupResponseMapper.SELECT,
    });

    return {
      data: datatable.data.map(TopupResponseMapper.fromQuery),
      total: datatable.total,
    };
  }

  /**
   * Topup
   * @param user user
   * @param amount amount
   * @param topupId topup id
   * @param orderId order id (optional)
   * @returns
   */
  async topup(
    user: Session,
    amount: Decimal,
    topupId: string,
    orderId?: string,
  ) {
    const isActive = await this.paymentGatewayService.isActive(topupId);
    if (!isActive) throw new BadGatewayException(`${topupId} is not active`);

    switch (topupId) {
      case 'promptpay-manual':
        return this.createPromptpayManualCharge(user, amount, orderId);
      default:
        this.logger.error(
          `Payment method ${topupId} is not supported. Falling back to default.`,
        );
        throw new BadGatewayException(
          `Payment method ${topupId} is not supported.`,
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
        ...TransactionResponseMapper.SELECT,
        amount: true,
        payment: {
          select: {
            id: true,
            metadata: true,
            label: true,
          },
        },
      },
    });

    return charge;
  }

  /**
   * Confirm charge
   * @param chargeId charge id
   * @returns confirmed charge
   */
  public async confirm(chargeId: string) {
    const charge = await this.prisma.userWalletTransaction.update({
      where: {
        id: chargeId,
        status: TransactionStatus.CREATED,
      },
      data: {
        status: TransactionStatus.PENDING,
      },
      select: TransactionResponseMapper.SELECT,
    });

    const result = TransactionResponseMapper.fromQuery(charge);

    this.eventService.admin.onNewJobTransaction(result);
    return result;
  }

  /**
   * Create promptpay manual charge
   * @param user user
   * @param amount amount
   * @param orderId order id (optional)
   * @returns created charge
   */
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

    this.eventService.admin.onNewJobTransaction(
      TransactionResponseMapper.fromQuery(charge),
    );

    return {
      ...charge,
      qrcode: generatePayload(metadata.number, {
        amount: amount.toNumber(),
      }),
    };
  }
}
