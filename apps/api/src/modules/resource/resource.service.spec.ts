import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceService } from './resource.service';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('ResourceService', () => {
  let service: ResourceService;
  let prisma: jest.Mocked<any>;
  let storage: jest.Mocked<any>;

  const mockResource = {
    id: 'res-1',
    url: 'resource/mock-uuid.png',
    type: 'RESOURCE_IMAGE',
    createdAt: new Date(),
    user: { id: 'user-1', displayName: 'Admin' },
  };

  beforeEach(async () => {
    prisma = {
      resource: {
        findUnique: jest.fn(),
        create: jest.fn(),
        getDatatable: jest.fn(),
      },
    };

    storage = {
      uploadResourceImage: jest.fn(),
      copyObject: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudflareService, useValue: storage },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
  });

  describe('findOne', () => {
    it('should return resource when found', async () => {
      prisma.resource.findUnique.mockResolvedValue(mockResource);

      const result = await service.findOne('res-1');

      expect(result).toBeDefined();
    });

    it('should throw when resource not found', async () => {
      prisma.resource.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        'resource_not_found',
      );
    });
  });

  describe('uploadResource', () => {
    it('should upload file and create resource record', async () => {
      storage.uploadResourceImage.mockResolvedValue({
        key: 'resource/mock-uuid.png',
      });
      prisma.resource.create.mockResolvedValue(mockResource);

      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const result = await service.uploadResource(mockFile, 'user-1');

      expect(storage.uploadResourceImage).toHaveBeenCalledWith(mockFile);
      expect(prisma.resource.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('uploadResources', () => {
    it('should upload multiple files', async () => {
      storage.uploadResourceImage.mockResolvedValue({
        key: 'resource/mock-uuid.png',
      });
      prisma.resource.create.mockResolvedValue(mockResource);

      const files = [
        { buffer: Buffer.from('1'), mimetype: 'image/png' },
        { buffer: Buffer.from('2'), mimetype: 'image/jpeg' },
      ] as Express.Multer.File[];

      const result = await service.uploadResources(files, 'user-1');

      expect(storage.uploadResourceImage).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
    });
  });

  describe('copyResourceToProduct', () => {
    it('should copy resource to product path', async () => {
      prisma.resource.findUnique.mockResolvedValue({
        id: 'res-1',
        url: 'resource/original.png',
      });
      storage.copyObject.mockResolvedValue(undefined);

      const result = await service.copyResourceToProduct('res-1');

      expect(storage.copyObject).toHaveBeenCalled();
      expect(result).toHaveProperty('key');
    });

    it('should throw BadRequestException when resource not found', async () => {
      prisma.resource.findUnique.mockResolvedValue(null);

      await expect(service.copyResourceToProduct('bad-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
