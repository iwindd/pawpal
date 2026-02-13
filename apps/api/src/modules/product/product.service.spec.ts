import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceService } from '../resource/resource.service';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: jest.Mocked<any>;
  let productRepo: jest.Mocked<any>;
  let resourceService: jest.Mocked<any>;

  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ProductCollection-like object returned by repo
  const mockProductCollection = {
    toJSON: jest.fn().mockReturnValue([mockProduct]),
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        getDatatable: jest.fn(),
      },
      package: {
        findMostSaleByProduct: jest.fn(),
      },
      resource: {
        create: jest.fn(),
      },
    };

    productRepo = {
      getLatest: jest.fn().mockResolvedValue(mockProductCollection),
      getHasSale: jest.fn().mockResolvedValue(mockProductCollection),
    };

    resourceService = {
      copyResourceToProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProductRepository, useValue: productRepo },
        { provide: ResourceService, useValue: resourceService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  describe('getNewProducts', () => {
    it('should return new products with default limit', async () => {
      const result = await service.getNewProducts();

      expect(productRepo.getLatest).toHaveBeenCalledWith({ take: 4 });
      expect(result).toEqual([mockProduct]);
    });

    it('should return new products with custom limit', async () => {
      await service.getNewProducts(8);

      expect(productRepo.getLatest).toHaveBeenCalledWith({ take: 8 });
    });
  });

  describe('getSaleProducts', () => {
    it('should return sale products with default limit', async () => {
      const result = await service.getSaleProducts();

      expect(productRepo.getHasSale).toHaveBeenCalledWith({ take: 4 });
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('getProductBySlug', () => {
    it('should return product by slug', async () => {
      prisma.product.findUnique.mockResolvedValue({
        ...mockProduct,
        category: { id: 'cat-1', name: 'Category', slug: 'cat' },
        productTags: [],
        packages: [],
        fields: [],
      });
      prisma.package.findMostSaleByProduct.mockResolvedValue(null);

      const result = await service.getProductBySlug('test-product');

      expect(prisma.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'test-product' },
        }),
      );
      expect(result).toBeDefined();
    });

    it('should return null when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const result = await service.getProductBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return product by id', async () => {
      prisma.product.findUnique.mockResolvedValue({
        ...mockProduct,
        category: { id: 'cat-1', name: 'Category', slug: 'cat' },
        image: { id: 'img-1', url: 'https://example.com/img.png' },
        productTags: [],
        _count: { packages: 0 },
      });

      const result = await service.findOne('prod-1');

      expect(prisma.product.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'prod-1' },
        }),
      );
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getProductDatatable', () => {
    it('should return datatable from prisma', async () => {
      const mockResult = { data: [mockProduct], total: 1 };
      prisma.product.getDatatable.mockResolvedValue(mockResult);

      const result = await service.getProductDatatable({
        skip: 0,
        take: 10,
        orderBy: {},
      } as any);

      expect(prisma.product.getDatatable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      resourceService.copyResourceToProduct.mockResolvedValue({
        key: 'product/img.png',
      });
      prisma.product.create.mockResolvedValue(mockProduct);

      const result = await service.createProduct(
        {
          name: 'Test Product',
          slug: 'test-product',
          description: 'A test',
          category_id: 'cat-1',
          image_id: 'res-1',
        } as any,
        'user-1',
      );

      expect(resourceService.copyResourceToProduct).toHaveBeenCalledWith(
        'res-1',
      );
      expect(prisma.product.create).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
});
