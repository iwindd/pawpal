import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentGatewayService } from './payment-gateway.service';

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;
  let prisma: jest.Mocked<any>;

  const mockGateway = {
    id: 'promptpay-manual',
    label: 'PromptPay',
    text: 'Pay via PromptPay',
    isActive: true,
    order: 0,
  };

  beforeEach(async () => {
    prisma = {
      paymentGateway: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentGatewayService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PaymentGatewayService>(PaymentGatewayService);
  });

  describe('findAllActive', () => {
    it('should return all active gateways', async () => {
      prisma.paymentGateway.findMany.mockResolvedValue([mockGateway]);

      const result = await service.findAllActive();

      expect(prisma.paymentGateway.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        }),
      );
      expect(result).toEqual([mockGateway]);
    });
  });

  describe('getGateway', () => {
    it('should return gateway by id', async () => {
      prisma.paymentGateway.findUniqueOrThrow.mockResolvedValue({
        id: 'promptpay-manual',
        metadata: { number: '0812345678' },
      });

      const result = await service.getGateway('promptpay-manual');

      expect(result.id).toBe('promptpay-manual');
    });
  });

  describe('isActive', () => {
    it('should return true for active gateway', async () => {
      prisma.paymentGateway.findUnique.mockResolvedValue({ isActive: true });

      const result = await service.isActive('promptpay-manual');

      expect(result).toBe(true);
    });

    it('should return false for inactive gateway', async () => {
      prisma.paymentGateway.findUnique.mockResolvedValue({ isActive: false });

      const result = await service.isActive('disabled-gateway');

      expect(result).toBe(false);
    });

    it('should return undefined when gateway does not exist', async () => {
      prisma.paymentGateway.findUnique.mockResolvedValue(null);

      const result = await service.isActive('non-existent');

      expect(result).toBeUndefined();
    });
  });

  describe('updatePromptpayManualMetadata', () => {
    it('should update metadata for promptpay-manual gateway', async () => {
      prisma.paymentGateway.findUniqueOrThrow.mockResolvedValue({
        id: 'promptpay-manual',
        metadata: {},
      });
      const updatedGateway = {
        id: 'promptpay-manual',
        name: 'promptpay-manual',
        label: 'PromptPay',
        metadata: { number: '0899999999' },
      };
      prisma.paymentGateway.update.mockResolvedValue(updatedGateway);

      const result = await service.updatePromptpayManualMetadata({
        number: '0899999999',
      } as any);

      expect(result).toEqual(updatedGateway);
    });
  });
});
