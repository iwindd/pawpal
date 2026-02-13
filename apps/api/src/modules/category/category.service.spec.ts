import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: jest.Mocked<any>;

  const mockDbCategory = {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const expectedResponse = {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    prisma = {
      category: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      prisma.category.findMany.mockResolvedValue([mockDbCategory]);

      const result = await service.findAll();

      expect(result).toEqual([expectedResponse]);
    });

    it('should filter by search term', async () => {
      prisma.category.findMany.mockResolvedValue([mockDbCategory]);

      await service.findAll('electron');

      expect(prisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: { contains: 'electron', mode: 'insensitive' } },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return category when found', async () => {
      prisma.category.findUnique.mockResolvedValue(mockDbCategory);

      const result = await service.findOne('cat-1');

      expect(result).toEqual(expectedResponse);
    });

    it('should throw BadRequestException when not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create category when slug is unique', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      prisma.category.create.mockResolvedValue(mockDbCategory);

      const result = await service.create({
        name: 'Electronics',
        slug: 'electronics',
      });

      expect(result).toEqual(expectedResponse);
    });

    it('should throw BadRequestException when slug exists', async () => {
      prisma.category.findUnique.mockResolvedValue(mockDbCategory);

      await expect(
        service.create({ name: 'Electronics', slug: 'electronics' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update category', async () => {
      prisma.category.findUnique
        .mockResolvedValueOnce(mockDbCategory) // exists check
        .mockResolvedValueOnce(null); // slug uniqueness check (new slug doesn't exist)
      prisma.category.update.mockResolvedValue({
        ...mockDbCategory,
        name: 'Updated',
      });

      const result = await service.update('cat-1', {
        name: 'Updated',
        slug: 'updated',
      });

      expect(result.name).toBe('Updated');
    });

    it('should throw when category not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.update('bad-id', { name: 'Updated' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when slug already exists on another category', async () => {
      prisma.category.findUnique
        .mockResolvedValueOnce(mockDbCategory) // exists check
        .mockResolvedValueOnce({ id: 'cat-2', slug: 'taken' }); // slug taken

      await expect(
        service.update('cat-1', { name: 'Updated', slug: 'taken' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete category with no products', async () => {
      prisma.category.findUnique.mockResolvedValue(mockDbCategory);
      prisma.product.count.mockResolvedValue(0);
      prisma.category.delete.mockResolvedValue(mockDbCategory);

      const result = await service.remove('cat-1');

      expect(result).toEqual({ success: true });
    });

    it('should throw when category not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw when category has products', async () => {
      prisma.category.findUnique.mockResolvedValue(mockDbCategory);
      prisma.product.count.mockResolvedValue(5);

      await expect(service.remove('cat-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
