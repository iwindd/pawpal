import { TransactionStatus, TransactionType } from '@/generated/prisma/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepository } from './transaction.repository';

describe('TransactionRepository', () => {
  let repo: TransactionRepository;
  let prisma: jest.Mocked<any>;

  const mockTransactionData = {
    id: 'txn-1',
    balance_after: new Decimal(200),
    balance_before: new Decimal(100),
    type: TransactionType.TOPUP,
    status: TransactionStatus.CREATED,
    currency: 'THB',
    createdAt: new Date(),
    updatedAt: new Date(),
    payment_gateway_id: 'gw-1',
    order: null,
    wallet: {
      id: 'wallet-1',
      user_id: 'user-1',
      walletType: 'MAIN',
    },
  };

  beforeEach(async () => {
    prisma = {
      userWalletTransaction: {
        findFirstOrThrow: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repo = module.get<TransactionRepository>(TransactionRepository);
  });

  describe('find', () => {
    it('should find transaction and return entity', async () => {
      prisma.userWalletTransaction.findFirstOrThrow.mockResolvedValue(
        mockTransactionData,
      );

      const result = await repo.find('txn-1');

      expect(
        prisma.userWalletTransaction.findFirstOrThrow,
      ).toHaveBeenCalledWith({
        where: { id: 'txn-1' },
        select: TransactionRepository.DEFAULT_SELECT,
      });
      expect(result.id).toBe('txn-1');
      expect(result.type).toBe(TransactionType.TOPUP);
      expect(result.userId).toBe('user-1');
    });
  });

  describe('create', () => {
    it('should create transaction and return entity', async () => {
      prisma.userWalletTransaction.create.mockResolvedValue(
        mockTransactionData,
      );

      const input = {
        type: TransactionType.TOPUP,
        balance_before: new Decimal(100),
        balance_after: new Decimal(200),
        amount: new Decimal(100),
        status: TransactionStatus.CREATED,
        wallet: { connect: { id: 'wallet-1' } },
      } as any;

      const result = await repo.create(input);

      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith({
        data: input,
        select: TransactionRepository.DEFAULT_SELECT,
      });
      expect(result.id).toBe('txn-1');
    });
  });

  describe('createCharge', () => {
    it('should create TOPUP_FOR_PURCHASE when orderId is provided', async () => {
      prisma.userWalletTransaction.create.mockResolvedValue(
        mockTransactionData,
      );

      const mockWallet = {
        id: 'wallet-1',
        balance: new Decimal(100),
        walletType: 'MAIN',
      } as any;

      await repo.createCharge(new Decimal(200), 'gw-1', 'order-1', mockWallet);

      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: TransactionType.TOPUP_FOR_PURCHASE,
            amount: new Decimal(200),
            balance_before: new Decimal(100),
            balance_after: new Decimal(300),
            status: TransactionStatus.CREATED,
          }),
        }),
      );
    });

    it('should use provided status', async () => {
      prisma.userWalletTransaction.create.mockResolvedValue(
        mockTransactionData,
      );

      const mockWallet = {
        id: 'wallet-1',
        balance: new Decimal(0),
        walletType: 'MAIN',
      } as any;

      await repo.createCharge(
        new Decimal(500),
        'gw-1',
        'order-1',
        mockWallet,
        TransactionStatus.PENDING,
      );

      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: TransactionStatus.PENDING,
          }),
        }),
      );
    });

    it('should compute balance_after correctly', async () => {
      prisma.userWalletTransaction.create.mockResolvedValue(
        mockTransactionData,
      );

      const mockWallet = {
        id: 'wallet-1',
        balance: new Decimal(150),
        walletType: 'MAIN',
      } as any;

      await repo.createCharge(new Decimal(350), 'gw-1', 'order-1', mockWallet);

      expect(prisma.userWalletTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            balance_before: new Decimal(150),
            balance_after: new Decimal(500),
          }),
        }),
      );
    });
  });
});
