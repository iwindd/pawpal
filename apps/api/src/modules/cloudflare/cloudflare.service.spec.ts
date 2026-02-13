import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudflareService } from './cloudflare.service';

// Mock @aws-sdk/client-s3
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn().mockImplementation((params) => params),
  CopyObjectCommand: jest.fn().mockImplementation((params) => params),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('CloudflareService', () => {
  let service: CloudflareService;

  const mockConfigService = {
    getOrThrow: jest.fn().mockImplementation((key: string) => {
      const config: Record<string, string> = {
        R2_ACCOUNT_ID: 'test-account',
        R2_ACCESS_KEY_ID: 'test-key',
        R2_SECRET_ACCESS_KEY: 'test-secret',
        R2_BUCKET_NAME: 'test-bucket',
        R2_PUBLIC_URL: 'https://cdn.test.com',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudflareService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CloudflareService>(CloudflareService);
  });

  describe('uploadResourceImage', () => {
    it('should upload a file and return key', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
        originalname: 'test.png',
      } as Express.Multer.File;

      const result = await service.uploadResourceImage(mockFile);

      expect(result).toHaveProperty('key');
      expect(result.key).toContain('mock-uuid');
    });

    it('should throw when S3 upload fails', async () => {
      // Access the internal s3Client mock and make it fail
      const s3Client = (service as any).s3Client;
      s3Client.send = jest.fn().mockRejectedValue(new Error('Upload failed'));

      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      await expect(service.uploadResourceImage(mockFile)).rejects.toThrow(
        'Upload failed',
      );
    });
  });

  describe('copyObject', () => {
    it('should copy object in R2', async () => {
      await expect(
        service.copyObject('source-key', 'dest-key'),
      ).resolves.not.toThrow();
    });

    it('should throw when copy fails', async () => {
      const s3Client = (service as any).s3Client;
      s3Client.send = jest.fn().mockRejectedValue(new Error('Copy failed'));

      await expect(
        service.copyObject('source-key', 'dest-key'),
      ).rejects.toThrow('Copy failed');
    });
  });
});
