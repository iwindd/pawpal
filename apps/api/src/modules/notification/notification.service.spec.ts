import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: jest.Mocked<any>;

  beforeEach(async () => {
    prisma = {
      carousel: {
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  describe('findAll', () => {
    it('should return carousel count', async () => {
      prisma.carousel.count.mockResolvedValue(5);

      const result = await service.findAll();

      expect(result).toEqual({ carousels: 5 });
      expect(prisma.carousel.count).toHaveBeenCalledWith({
        where: { status: 'PUBLISHED' },
      });
    });

    it('should return 0 when no published carousels', async () => {
      prisma.carousel.count.mockResolvedValue(0);

      const result = await service.findAll();

      expect(result).toEqual({ carousels: 0 });
    });
  });
});
