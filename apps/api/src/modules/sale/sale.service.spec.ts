import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service';
import { SaleService } from './sale.service';

describe('SaleService', () => {
  let service: SaleService;
  let prisma: jest.Mocked<any>;

  const mockSale = {
    id: 'sale-1',
    discount: new Decimal(20),
    discountType: 'PERCENT',
    startAt: new Date(),
    endAt: new Date(Date.now() + 86400000),
    isActive: true,
  };

  beforeEach(async () => {
    prisma = {
      package: {
        findMany: jest.fn(),
      },
      sale: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SaleService>(SaleService);
  });

  describe('getPackagesHasSaleByProduct', () => {
    it('should return packages with active sales', async () => {
      const mockPackages = [
        { id: 'pkg-1', name: 'Basic', price: new Decimal(100), sales: [] },
      ];
      prisma.package.findMany.mockResolvedValue(mockPackages);

      const result = await service.getPackagesHasSaleByProduct('test-product');

      expect(prisma.package.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockPackages);
    });
  });

  describe('getSalesByProduct', () => {
    it('should return sales without conversion when all PERCENT type', async () => {
      prisma.sale.findMany.mockResolvedValue([mockSale]);

      const result = await service.getSalesByProduct('test-product');

      expect(result).toEqual([mockSale]);
    });

    it('should convert FIXED discounts to PERCENT', async () => {
      const fixedSale = {
        ...mockSale,
        id: 'sale-2',
        discount: new Decimal(50),
        discountType: 'FIXED',
      };
      prisma.sale.findMany.mockResolvedValue([fixedSale]);
      prisma.package.findMany.mockResolvedValue([
        { id: 'pkg-1', price: new Decimal(200), sales: [] },
      ]);

      const result = await service.getSalesByProduct('test-product');

      expect(result[0].discountType).toBe('PERCENT');
      // 50/200 * 100 = 25%
      expect(result[0].discount).toBe(25);
    });

    it('should keep PERCENT sales as-is when mixed with FIXED', async () => {
      const percentSale = { ...mockSale, discount: new Decimal(10) };
      const fixedSale = {
        ...mockSale,
        id: 'sale-2',
        discount: new Decimal(20),
        discountType: 'FIXED',
      };
      prisma.sale.findMany.mockResolvedValue([percentSale, fixedSale]);
      prisma.package.findMany.mockResolvedValue([
        { id: 'pkg-1', price: new Decimal(100), sales: [] },
      ]);

      const result = await service.getSalesByProduct('test-product');

      expect(result[0].discount).toEqual(new Decimal(10)); // PERCENT stays
      expect(result[1].discount).toBe(20); // FIXED converted: 20/100 * 100 = 20%
    });

    it('should return empty array when no sales exist', async () => {
      prisma.sale.findMany.mockResolvedValue([]);

      const result = await service.getSalesByProduct('test-product');

      expect(result).toEqual([]);
    });
  });
});
