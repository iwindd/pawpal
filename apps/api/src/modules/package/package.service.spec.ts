import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PackageService } from './package.service';

describe('PackageService', () => {
  let service: PackageService;
  let prisma: jest.Mocked<any>;

  const mockPackage = {
    id: 'pkg-1',
    name: 'Basic Package',
    description: 'A basic package',
    price: 100,
    createdAt: new Date(),
  };

  const mockFields = [
    {
      id: 'field-1',
      order: 0,
      label: 'Name',
      placeholder: 'Enter name',
      metadata: {},
      type: 'TEXT',
      optional: false,
    },
  ];

  beforeEach(async () => {
    prisma = {
      package: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        getDatatable: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PackageService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PackageService>(PackageService);
  });

  describe('getFields', () => {
    it('should return product fields for a package', async () => {
      prisma.package.findUnique.mockResolvedValue({
        product: { fields: mockFields },
      });

      const result = await service.getFields('pkg-1');

      expect(result).toEqual(mockFields);
    });

    it('should throw NotFoundException when package not found', async () => {
      prisma.package.findUnique.mockResolvedValue(null);

      await expect(service.getFields('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProductPackageDatatable', () => {
    it('should return paginated packages', async () => {
      const mockResult = { data: [mockPackage], total: 1 };
      prisma.package.getDatatable.mockResolvedValue(mockResult);

      const result = await service.getProductPackageDatatable('product-1', {
        skip: 0,
        take: 10,
        orderBy: {},
      } as any);

      expect(result).toEqual(mockResult);
    });
  });

  describe('createPackageForProduct', () => {
    it('should create a package for a product', async () => {
      prisma.package.create.mockResolvedValue(mockPackage);

      const result = await service.createPackageForProduct('product-1', {
        name: 'Basic Package',
        description: 'A basic package',
        price: 100,
      });

      expect(prisma.package.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Basic Package',
            product: { connect: { id: 'product-1' } },
          }),
        }),
      );
      expect(result).toEqual(mockPackage);
    });
  });

  describe('update', () => {
    it('should update a package', async () => {
      const updated = { ...mockPackage, name: 'Premium Package' };
      prisma.package.update.mockResolvedValue(updated);

      const result = await service.update('pkg-1', {
        name: 'Premium Package',
        description: 'A premium package',
        price: 200,
      });

      expect(result.name).toBe('Premium Package');
    });
  });
});
