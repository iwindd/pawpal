import { TransactionStatus, TransactionType } from '@/generated/prisma/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { EventService } from '../event/event.service';
import { OrderRepository } from '../order/order.repository';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from '../wallet/wallet.repository';
import { TransactionRepository } from './transaction.repository';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: jest.Mocked<any>;
  let eventService: jest.Mocked<any>;
  let walletRepo: jest.Mocked<any>;
  let orderRepo: jest.Mocked<any>;
  let transactionRepo: jest.Mocked<any>;

  beforeEach(async () => {
    prisma = {
      userWalletTransaction: {
        success: jest.fn(),
        failed: jest.fn(),
        getDatatable: jest.fn(),
      },
      order: {
        pending: jest.fn(),
        cancel: jest.fn(),
        findUniqueOrThrow: jest.fn(),
      },
    };

    eventService = {
      admin: {
        onFinishedJobTransaction: jest.fn(),
        onNewJobOrder: jest.fn(),
      },
      user: {
        onTopupTransactionUpdated: jest.fn(),
      },
    };

    walletRepo = {
      updateWalletBalanceOrThrow: jest.fn(),
    };

    orderRepo = {};

    transactionRepo = {
      find: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventService, useValue: eventService },
        { provide: WalletRepository, useValue: walletRepo },
        { provide: OrderRepository, useValue: orderRepo },
        { provide: TransactionRepository, useValue: transactionRepo },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  describe('successCharge', () => {
    it('should handle TOPUP transaction — update wallet and emit events', async () => {
      const mockTransaction = {
        id: 'txn-1',
        type: TransactionType.TOPUP,
        balanceBefore: new Decimal(100),
        balanceAfter: new Decimal(200),
        userId: 'user-1',
        walletId: 'wallet-1',
        walletType: 'MAIN',
        orderId: null,
        total: null,
        toJson: jest.fn().mockReturnValue({ id: 'txn-1' }),
      };
      transactionRepo.find.mockResolvedValue(mockTransaction);

      const result = await service.successCharge('txn-1', 'admin-1');

      expect(transactionRepo.find).toHaveBeenCalledWith('txn-1');
      expect(prisma.userWalletTransaction.success).toHaveBeenCalledWith(
        'txn-1',
        'admin-1',
      );
      expect(walletRepo.updateWalletBalanceOrThrow).toHaveBeenCalledWith(
        new Decimal(200),
        'user-1',
        'MAIN',
      );
      expect(eventService.admin.onFinishedJobTransaction).toHaveBeenCalledWith({
        id: 'txn-1',
      });
      expect(eventService.user.onTopupTransactionUpdated).toHaveBeenCalledWith(
        'user-1',
        {
          id: 'txn-1',
          status: TransactionStatus.SUCCEEDED,
          balance: 200,
          walletType: 'MAIN',
        },
      );
      expect(result).toEqual({
        transactionId: 'txn-1',
        balanceBefore: new Decimal(100),
        balanceAfter: new Decimal(200),
        balance: new Decimal(200),
      });
    });

    it('should handle TOPUP_FOR_PURCHASE — pend order, create purchase transaction, update wallet', async () => {
      const mockTransaction = {
        id: 'txn-2',
        type: TransactionType.TOPUP_FOR_PURCHASE,
        balanceBefore: new Decimal(0),
        balanceAfter: new Decimal(500),
        userId: 'user-1',
        walletId: 'wallet-1',
        walletType: 'MAIN',
        orderId: 'order-1',
        total: new Decimal(500),
        toJson: jest.fn().mockReturnValue({ id: 'txn-2' }),
      };
      transactionRepo.find.mockResolvedValue(mockTransaction);
      transactionRepo.create.mockResolvedValue(mockTransaction);
      prisma.order.findUniqueOrThrow.mockResolvedValue({
        id: 'order-1',
        total: new Decimal(500),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 'user-1', email: 'test@test.com', displayName: 'Test' },
        orderPackages: [],
        orderFields: [],
        userWalletTransactions: [],
      });

      await service.successCharge('txn-2', 'admin-1');

      expect(prisma.order.pending).toHaveBeenCalledWith('order-1');
      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TransactionType.PURCHASE,
          status: TransactionStatus.PENDING,
        }),
      );
      expect(walletRepo.updateWalletBalanceOrThrow).toHaveBeenCalled();
    });

    it('should throw if transaction type is PURCHASE', async () => {
      const mockTransaction = {
        id: 'txn-3',
        type: TransactionType.PURCHASE,
      };
      transactionRepo.find.mockResolvedValue(mockTransaction);

      await expect(service.successCharge('txn-3', 'admin-1')).rejects.toThrow(
        'Transaction is not topup transaction',
      );
    });
  });

  describe('failCharge', () => {
    it('should fail the transaction and emit events', async () => {
      const mockTransaction = {
        id: 'txn-4',
        type: TransactionType.TOPUP,
        balanceBefore: new Decimal(100),
        balanceAfter: new Decimal(200),
        userId: 'user-1',
        walletType: 'MAIN',
        orderId: null,
        toJson: jest.fn().mockReturnValue({ id: 'txn-4' }),
      };
      transactionRepo.find.mockResolvedValue(mockTransaction);

      await service.failCharge('txn-4', 'admin-1');

      expect(prisma.userWalletTransaction.failed).toHaveBeenCalledWith(
        'txn-4',
        'admin-1',
      );
      expect(eventService.admin.onFinishedJobTransaction).toHaveBeenCalledWith({
        id: 'txn-4',
      });
      expect(eventService.user.onTopupTransactionUpdated).toHaveBeenCalledWith(
        'user-1',
        {
          id: 'txn-4',
          status: TransactionStatus.FAILED,
          balance: 100,
          walletType: 'MAIN',
        },
      );
    });

    it('should cancel order if orderId exists', async () => {
      const mockTransaction = {
        id: 'txn-5',
        type: TransactionType.TOPUP_FOR_PURCHASE,
        balanceBefore: new Decimal(0),
        balanceAfter: new Decimal(300),
        userId: 'user-1',
        walletType: 'MAIN',
        orderId: 'order-1',
        toJson: jest.fn().mockReturnValue({ id: 'txn-5' }),
      };
      transactionRepo.find.mockResolvedValue(mockTransaction);

      await service.failCharge('txn-5', 'admin-1');

      expect(prisma.order.cancel).toHaveBeenCalledWith('order-1', 'admin-1');
    });

    it('should NOT cancel order if orderId is null', async () => {
      const mockTransaction = {
        id: 'txn-6',
        type: TransactionType.TOPUP,
        balanceBefore: new Decimal(100),
        balanceAfter: new Decimal(200),
        userId: 'user-1',
        walletType: 'MAIN',
        orderId: null,
        toJson: jest.fn().mockReturnValue({ id: 'txn-6' }),
      };
      transactionRepo.find.mockResolvedValue(mockTransaction);

      await service.failCharge('txn-6', 'admin-1');

      expect(prisma.order.cancel).not.toHaveBeenCalled();
    });
  });

  describe('getJobTransactionsDatatable', () => {
    it('should call getDatatable with correct filters', async () => {
      const mockQuery = { skip: 0, take: 10 };
      const mockResult = { data: [], total: 0 };
      prisma.userWalletTransaction.getDatatable.mockResolvedValue(mockResult);

      const result = await service.getJobTransactionsDatatable(
        mockQuery as any,
      );

      expect(prisma.userWalletTransaction.getDatatable).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { status: TransactionStatus.PENDING },
              { status: TransactionStatus.CREATED },
            ]),
          }),
        }),
      );
      expect(result).toEqual(mockResult);
    });
  });
});
