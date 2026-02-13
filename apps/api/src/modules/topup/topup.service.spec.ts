import { TransactionStatus, TransactionType } from '@/generated/prisma/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { EventService } from '../event/event.service';
import { PaymentGatewayService } from '../payment-gateway/payment-gateway.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from '../wallet/wallet.repository';
import { TopupService } from './topup.service';

describe('TopupService', () => {
  let service: TopupService;
  let prisma: jest.Mocked<any>;
  let paymentGatewayService: jest.Mocked<any>;
  let eventService: jest.Mocked<any>;
  let walletRepo: jest.Mocked<any>;

  beforeEach(async () => {
    prisma = {
      userWalletTransaction: {
        create: jest.fn(),
        update: jest.fn(),
        getDatatable: jest.fn(),
      },
    };

    paymentGatewayService = {
      isActive: jest.fn(),
      getGateway: jest.fn(),
    };

    eventService = {
      admin: {
        onNewJobTransaction: jest.fn(),
      },
      user: {},
    };

    walletRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopupService,
        { provide: PrismaService, useValue: prisma },
        { provide: PaymentGatewayService, useValue: paymentGatewayService },
        { provide: EventService, useValue: eventService },
        { provide: WalletRepository, useValue: walletRepo },
      ],
    }).compile();

    service = module.get<TopupService>(TopupService);
  });

  describe('topup', () => {
    const mockUser = { id: 'user-1', name: 'Test User' } as any;

    it('should throw BadGatewayException when gateway is inactive', async () => {
      paymentGatewayService.isActive.mockResolvedValue(false);

      await expect(
        service.topup(mockUser, new Decimal(100), 'promptpay-manual'),
      ).rejects.toThrow('promptpay-manual is not active');
    });

    it('should throw BadGatewayException for unsupported payment method', async () => {
      paymentGatewayService.isActive.mockResolvedValue(true);

      await expect(
        service.topup(mockUser, new Decimal(100), 'unknown-method'),
      ).rejects.toThrow('Payment method unknown-method is not supported.');
    });

    it('should delegate to createPromptpayManualCharge for promptpay-manual', async () => {
      paymentGatewayService.isActive.mockResolvedValue(true);
      paymentGatewayService.getGateway.mockResolvedValue({
        id: 'promptpay-manual',
        metadata: { name: 'Test', number: '0812345678' },
      });
      walletRepo.find.mockResolvedValue({
        id: 'wallet-1',
        balance: new Decimal(0),
        walletType: 'MAIN',
      });
      prisma.userWalletTransaction.create.mockResolvedValue({
        id: 'txn-1',
        type: TransactionType.TOPUP,
        balanceBefore: new Decimal(0),
        balanceAfter: new Decimal(100),
        amount: new Decimal(100),
        status: TransactionStatus.CREATED,
        currency: 'THB',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentGatewayId: 'promptpay-manual',
        orderId: null,
        payment: { id: 'promptpay-manual', metadata: {}, label: 'PromptPay' },
      });

      const result = await service.topup(
        mockUser,
        new Decimal(100),
        'promptpay-manual',
      );

      expect(result).toHaveProperty('qrcode');
      expect(prisma.userWalletTransaction.create).toHaveBeenCalled();
    });
  });

  describe('createCharge', () => {
    it('should create a TOPUP transaction when no orderId', async () => {
      walletRepo.find.mockResolvedValue({
        id: 'wallet-1',
        balance: new Decimal(100),
        walletType: 'MAIN',
      });
      prisma.userWalletTransaction.create.mockResolvedValue({
        id: 'txn-1',
        type: TransactionType.TOPUP,
        amount: new Decimal(200),
      });

      const result = await service.createCharge(
        'user-1',
        new Decimal(200),
        'gateway-1',
      );

      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: TransactionType.TOPUP,
            amount: new Decimal(200),
            balanceBefore: new Decimal(100),
            balanceAfter: new Decimal(300),
          }),
        }),
      );
      expect(result).toHaveProperty('id', 'txn-1');
    });

    it('should create a TOPUP_FOR_PURCHASE transaction when orderId is provided', async () => {
      walletRepo.find.mockResolvedValue({
        id: 'wallet-1',
        balance: new Decimal(50),
        walletType: 'MAIN',
      });
      prisma.userWalletTransaction.create.mockResolvedValue({
        id: 'txn-2',
        type: TransactionType.TOPUP_FOR_PURCHASE,
        amount: new Decimal(300),
      });

      await service.createCharge(
        'user-1',
        new Decimal(300),
        'gateway-1',
        'order-1',
      );

      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: TransactionType.TOPUP_FOR_PURCHASE,
          }),
        }),
      );
    });
  });

  describe('confirm', () => {
    it('should update status to PENDING and emit admin event', async () => {
      const mockCharge = {
        id: 'txn-1',
        status: TransactionStatus.PENDING,
        type: TransactionType.TOPUP,
        balanceBefore: new Decimal(0),
        balanceAfter: new Decimal(100),
        currency: 'THB',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentGatewayId: 'gw-1',
        orderId: null,
      };
      prisma.userWalletTransaction.update.mockResolvedValue(mockCharge);

      const result = await service.confirm('txn-1');

      expect(prisma.userWalletTransaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: 'txn-1',
            status: TransactionStatus.CREATED,
          },
          data: {
            status: TransactionStatus.PENDING,
          },
        }),
      );
      expect(eventService.admin.onNewJobTransaction).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getTopupHistoryDatatable', () => {
    it('should query transactions for user with no order_id', async () => {
      const mockResult = { data: [], total: 0 };
      prisma.userWalletTransaction.getDatatable.mockResolvedValue(mockResult);

      const result = await service.getTopupHistoryDatatable('user-1', {
        skip: 0,
        take: 10,
      } as any);

      expect(prisma.userWalletTransaction.getDatatable).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            wallet: { userId: 'user-1' },
            orderId: null,
          }),
        }),
      );
      expect(result).toHaveProperty('total', 0);
    });
  });
});
