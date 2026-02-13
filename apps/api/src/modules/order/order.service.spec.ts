import {
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';
import { TopupService } from '../topup/topup.service';
import { WalletRepository } from '../wallet/wallet.repository';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: jest.Mocked<any>;
  let topupService: jest.Mocked<any>;
  let eventService: jest.Mocked<any>;
  let walletRepo: jest.Mocked<any>;
  let orderRepo: jest.Mocked<any>;

  beforeEach(async () => {
    prisma = {
      package: {
        getPackage: jest.fn(),
      },
      order: {
        create: jest.fn(),
        pending: jest.fn(),
        complete: jest.fn(),
        cancel: jest.fn(),
        findUniqueOrThrow: jest.fn(),
      },
      userWalletTransaction: {
        create: jest.fn(),
        update: jest.fn(),
        success: jest.fn(),
      },
    };

    topupService = {
      topup: jest.fn(),
    };

    eventService = {
      admin: {
        onNewJobOrder: jest.fn(),
        onFinishedJobOrder: jest.fn(),
      },
      user: {
        onPurchaseTransactionUpdated: jest.fn(),
      },
    };

    walletRepo = {
      find: jest.fn(),
      updateWalletBalanceOrThrow: jest.fn(),
    };

    orderRepo = {
      find: jest.fn(),
      toOrderResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: prisma },
        { provide: TopupService, useValue: topupService },
        { provide: EventService, useValue: eventService },
        { provide: WalletRepository, useValue: walletRepo },
        { provide: OrderRepository, useValue: orderRepo },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  describe('createOrder', () => {
    const mockUser = { id: 'user-1' } as any;
    const mockBody = {
      packageId: 'pkg-1',
      amount: 2,
      includeWalletBalance: true,
      paymentMethod: 'promptpay-manual',
      fields: [{ id: 'field-1', value: 'test-value' }],
    } as any;

    it('should create order and topup when wallet balance is insufficient', async () => {
      const mockPackage = { id: 'pkg-1', price: new Decimal(100) };
      prisma.package.getPackage.mockResolvedValue(mockPackage);

      const mockWallet = {
        id: 'wallet-1',
        balance: new Decimal(50),
        walletType: 'MAIN',
        getMissingAmount: jest.fn().mockResolvedValue(new Decimal(150)),
        updateBalance: jest.fn(),
      };
      walletRepo.find.mockResolvedValue(mockWallet);

      const mockOrder = {
        id: 'order-1',
        status: OrderStatus.CREATED,
        total: new Decimal(200),
      };
      prisma.order.create.mockResolvedValue(mockOrder);

      topupService.topup.mockResolvedValue({ id: 'charge-1' });

      const result = await service.createOrder(mockUser, mockBody);

      expect(result.type).toBe('topup');
      expect(topupService.topup).toHaveBeenCalledWith(
        mockUser,
        new Decimal(150),
        'promptpay-manual',
        'order-1',
      );
    });

    it('should create order with direct purchase when wallet has enough balance', async () => {
      const mockPackage = { id: 'pkg-1', price: new Decimal(100) };
      prisma.package.getPackage.mockResolvedValue(mockPackage);

      const mockWallet = {
        id: 'wallet-1',
        balance: new Decimal(500),
        walletType: 'MAIN',
        getMissingAmount: jest.fn().mockResolvedValue(new Decimal(0)),
        updateBalance: jest.fn(),
      };
      walletRepo.find.mockResolvedValue(mockWallet);

      const mockOrder = {
        id: 'order-1',
        status: OrderStatus.CREATED,
        total: new Decimal(200),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 'user-1', email: 'test@test.com', displayName: 'Test' },
        orderPackages: [],
        orderFields: [],
        userWalletTransactions: [],
      };
      prisma.order.create.mockResolvedValue(mockOrder);

      const mockTransaction = {
        id: 'txn-1',
        type: TransactionType.PURCHASE,
        amount: new Decimal(200),
        balanceBefore: new Decimal(500),
        balanceAfter: new Decimal(300),
        status: TransactionStatus.PENDING,
        currency: 'THB',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentGatewayId: 'promptpay-manual',
        orderId: 'order-1',
      };
      prisma.userWalletTransaction.create.mockResolvedValue(mockTransaction);

      const result = await service.createOrder(mockUser, mockBody);

      expect(result.type).toBe('purchase');
      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: TransactionType.PURCHASE,
            amount: new Decimal(200),
            status: TransactionStatus.PENDING,
          }),
        }),
      );
      expect(mockWallet.updateBalance).toHaveBeenCalledWith(new Decimal(300));
      expect(prisma.order.pending).toHaveBeenCalledWith('order-1');
    });
  });

  describe('completeOrder', () => {
    it('should complete order, update transaction, and emit events', async () => {
      const mockOrder = {
        id: 'order-1',
        userId: 'user-1',
        purchaseTransaction: {
          id: 'txn-1',
          type: TransactionType.PURCHASE,
          balanceBefore: new Decimal(500),
          balanceAfter: new Decimal(300),
          wallet: { balance: new Decimal(300), walletType: 'MAIN' },
        },
      };
      orderRepo.find.mockResolvedValue(mockOrder);
      orderRepo.toOrderResponse.mockResolvedValue({ id: 'order-1' });

      // findOne is called at the end, mock the internal call
      prisma.order.findUniqueOrThrow = jest.fn().mockResolvedValue({
        id: 'order-1',
        status: OrderStatus.COMPLETED,
      });
      // Mock findOne by mocking the full chain
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: 'order-1' } as any);

      await service.completeOrder('order-1', 'admin-1');

      expect(prisma.userWalletTransaction.success).toHaveBeenCalledWith(
        'txn-1',
        'admin-1',
      );
      expect(prisma.order.complete).toHaveBeenCalledWith('order-1', 'admin-1');
      expect(eventService.admin.onFinishedJobOrder).toHaveBeenCalled();
      expect(
        eventService.user.onPurchaseTransactionUpdated,
      ).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          id: 'order-1',
          status: OrderStatus.COMPLETED,
        }),
      );
    });

    it('should throw BadRequestException if order not found', async () => {
      orderRepo.find.mockResolvedValue(null);

      await expect(
        service.completeOrder('order-999', 'admin-1'),
      ).rejects.toThrow('invalid_order');
    });

    it('should throw BadRequestException if no purchase transaction', async () => {
      orderRepo.find.mockResolvedValue({
        id: 'order-1',
        purchaseTransaction: null,
      });

      await expect(service.completeOrder('order-1', 'admin-1')).rejects.toThrow(
        'invalid_order',
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order, refund wallet, fail transaction, and emit events', async () => {
      const mockOrder = {
        id: 'order-1',
        userId: 'user-1',
        purchaseTransaction: {
          id: 'txn-1',
          type: TransactionType.PURCHASE,
          balanceBefore: new Decimal(500),
          balanceAfter: new Decimal(300),
          wallet: { balance: new Decimal(300), walletType: 'MAIN' },
        },
      };
      orderRepo.find.mockResolvedValue(mockOrder);
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: 'order-1' } as any);

      await service.cancelOrder('order-1', 'admin-1');

      expect(prisma.userWalletTransaction.update).toHaveBeenCalledWith({
        where: { id: 'txn-1' },
        data: { status: TransactionStatus.FAILED },
      });
      expect(walletRepo.updateWalletBalanceOrThrow).toHaveBeenCalledWith(
        new Decimal(500),
        'user-1',
        'MAIN',
      );
      expect(prisma.order.cancel).toHaveBeenCalledWith('order-1', 'admin-1');
      expect(
        eventService.user.onPurchaseTransactionUpdated,
      ).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          id: 'order-1',
          status: OrderStatus.CANCELLED,
        }),
      );
    });

    it('should throw BadRequestException if order not found', async () => {
      orderRepo.find.mockResolvedValue(null);

      await expect(service.cancelOrder('order-999', 'admin-1')).rejects.toThrow(
        'invalid_order',
      );
    });
  });
});
