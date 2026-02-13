import { CarouselStatus } from '@/generated/prisma/enums';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CarouselService } from './carousel.service';

describe('CarouselService', () => {
  let service: CarouselService;
  let prisma: jest.Mocked<any>;

  const mockCarousel = {
    id: 'carousel-1',
    title: 'Test Carousel',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: CarouselStatus.DRAFT,
    product: { id: 'prod-1', slug: 'test-prod', name: 'Test Product' },
    image: { id: 'img-1', url: 'https://example.com/img.jpg' },
    creator: { id: 'user-1', displayName: 'Admin' },
    order: 0,
  };

  const mockSession = {
    id: 'user-1',
    email: 'admin@test.com',
    displayName: 'Admin',
  } as any;

  beforeEach(async () => {
    prisma = {
      carousel: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        getDatatable: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarouselService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CarouselService>(CarouselService);
  });

  describe('create', () => {
    it('should create a carousel', async () => {
      prisma.carousel.create.mockResolvedValue(mockCarousel);

      const result = await service.create(
        {
          title: 'Test Carousel',
          status: 'DRAFT' as any,
          resource_id: 'img-1',
          product_id: 'prod-1',
        },
        mockSession,
      );

      expect(prisma.carousel.create).toHaveBeenCalled();
      expect(result).toEqual(mockCarousel);
    });
  });

  describe('findOne', () => {
    it('should return carousel when found', async () => {
      prisma.carousel.findUnique.mockResolvedValue(mockCarousel);

      const result = await service.findOne('carousel-1');

      expect(result).toEqual(mockCarousel);
    });

    it('should throw BadRequestException when not found', async () => {
      prisma.carousel.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update and return carousel', async () => {
      const updated = { ...mockCarousel, title: 'Updated' };
      prisma.carousel.update.mockResolvedValue(updated);

      const result = await service.update('carousel-1', {
        title: 'Updated',
        status: 'DRAFT' as any,
        resource_id: 'img-1',
        product_id: null,
      });

      expect(result).toEqual(updated);
    });
  });

  describe('getAllCarouselDatatable', () => {
    it('should call getDatatable with non-published filter', async () => {
      const mockResult = { data: [mockCarousel], total: 1 };
      prisma.carousel.getDatatable.mockResolvedValue(mockResult);

      const query = { skip: 0, take: 10, orderBy: {} } as any;
      const result = await service.getAllCarouselDatatable(query);

      expect(prisma.carousel.getDatatable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('getPublishedCarouselDatatable', () => {
    it('should call getDatatable with PUBLISHED filter', async () => {
      const mockResult = { data: [mockCarousel], total: 1 };
      prisma.carousel.getDatatable.mockResolvedValue(mockResult);

      const result = await service.getPublishedCarouselDatatable();

      expect(prisma.carousel.getDatatable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('reorder', () => {
    it('should reorder carousel items (move down)', async () => {
      prisma.$transaction.mockImplementation(async (fn) => fn());
      prisma.carousel.updateMany.mockResolvedValue({ count: 1 });
      prisma.carousel.update.mockResolvedValue(mockCarousel);

      await service.reorder({
        fromIndex: 0,
        toIndex: 2,
        carousel_id: 'carousel-1',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should reorder carousel items (move up)', async () => {
      prisma.$transaction.mockImplementation(async (fn) => fn());
      prisma.carousel.updateMany.mockResolvedValue({ count: 1 });
      prisma.carousel.update.mockResolvedValue(mockCarousel);

      await service.reorder({
        fromIndex: 3,
        toIndex: 1,
        carousel_id: 'carousel-1',
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException on transaction error', async () => {
      prisma.$transaction.mockRejectedValue(new Error('DB error'));

      await expect(
        service.reorder({
          fromIndex: 0,
          toIndex: 2,
          carousel_id: 'carousel-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
