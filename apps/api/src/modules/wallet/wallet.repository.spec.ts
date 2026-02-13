import { WalletType } from '@/generated/prisma/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from './wallet.repository';

describe('WalletRepository', () => {
  let repo: WalletRepository;
  let prisma: jest.Mocked<any>;

  beforeEach(async () => {
    prisma = {
      userWallet: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repo = module.get<WalletRepository>(WalletRepository);
  });

  describe('find', () => {
    it('should return existing wallet', async () => {
      const mockWallet = {
        id: 'wallet-1',
        balance: new Decimal(100),
        walletType: WalletType.MAIN,
        user_id: 'user-1',
      };
      prisma.userWallet.findFirst.mockResolvedValue(mockWallet);

      const result = await repo.find('user-1');

      expect(prisma.userWallet.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            user_id: 'user-1',
            walletType: WalletType.MAIN,
          },
        }),
      );
      expect(result.id).toBe('wallet-1');
      expect(result.balance).toEqual(new Decimal(100));
    });

    it('should create wallet when not found', async () => {
      prisma.userWallet.findFirst.mockResolvedValue(null);
      const createdWallet = {
        id: 'wallet-new',
        balance: new Decimal(0),
        walletType: WalletType.MAIN,
        user_id: 'user-1',
      };
      prisma.userWallet.create.mockResolvedValue(createdWallet);

      const result = await repo.find('user-1');

      expect(prisma.userWallet.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            user_id: 'user-1',
            walletType: WalletType.MAIN,
            balance: 0,
          },
        }),
      );
      expect(result.id).toBe('wallet-new');
      expect(result.balance).toEqual(new Decimal(0));
    });
  });

  describe('updateWalletBalanceOrThrow', () => {
    it('should update wallet balance', async () => {
      prisma.userWallet.update.mockResolvedValue({
        id: 'wallet-1',
        balance: new Decimal(200),
      });

      await repo.updateWalletBalanceOrThrow(new Decimal(200), 'user-1');

      expect(prisma.userWallet.update).toHaveBeenCalledWith({
        where: {
          user_id_walletType: {
            user_id: 'user-1',
            walletType: WalletType.MAIN,
          },
        },
        data: {
          balance: new Decimal(200),
        },
      });
    });
  });

  describe('getMissingAmount', () => {
    it('should return full required amount when wallet not found', async () => {
      prisma.userWallet.findFirst.mockResolvedValue(null);

      const result = await repo.getMissingAmount(new Decimal(100), 'user-1');

      expect(result).toEqual(new Decimal(100));
    });

    it('should return 0 when wallet has enough balance', async () => {
      prisma.userWallet.findFirst.mockResolvedValue({
        balance: new Decimal(200),
      });

      const result = await repo.getMissingAmount(new Decimal(100), 'user-1');

      expect(result).toEqual(new Decimal(0));
    });

    it('should return difference when wallet has partial balance', async () => {
      prisma.userWallet.findFirst.mockResolvedValue({
        balance: new Decimal(40),
      });

      const result = await repo.getMissingAmount(new Decimal(100), 'user-1');

      expect(result).toEqual(new Decimal(60));
    });
  });

  describe('findAll', () => {
    it('should return wallet collection for user with wallets', async () => {
      const mockWallets = [
        {
          id: 'wallet-1',
          balance: new Decimal(100),
          walletType: WalletType.MAIN,
          user_id: 'user-1',
        },
      ];
      prisma.userWallet.findMany.mockResolvedValue(mockWallets);

      const result = await repo.findAll('user-1');

      expect(result).toBeDefined();
    });

    it('should create default wallet when user has no wallets', async () => {
      prisma.userWallet.findMany.mockResolvedValue([]);
      prisma.userWallet.findFirst.mockResolvedValue(null);
      prisma.userWallet.create.mockResolvedValue({
        id: 'wallet-new',
        balance: new Decimal(0),
        walletType: WalletType.MAIN,
        user_id: 'user-1',
      });

      const result = await repo.findAll('user-1');

      expect(prisma.userWallet.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
