import { CloudflareUtil } from '@/utils/cloudflareUtil';
import {
  CopyObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { IStorageService } from '../../domain/storage.port';

@Injectable()
export class R2StorageService implements IStorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.getOrThrow<string>('R2_ACCOUNT_ID');
    const accessKeyId =
      this.configService.getOrThrow<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    this.bucketName = this.configService.getOrThrow<string>('R2_BUCKET_NAME');
    this.publicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL');

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadResourceImage(
    file: Express.Multer.File,
  ): Promise<{ key: string }> {
    try {
      const imageName = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
      const key = CloudflareUtil.getR2Path('resource', imageName);

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      this.logger.log(`Uploaded file "${key}" to R2`);
      return { key };
    } catch (error) {
      this.logger.error('Failed to upload file to R2', error);
      throw error;
    }
  }

  async copyObject(key: string, newKey: string): Promise<void> {
    try {
      await this.s3Client.send(
        new CopyObjectCommand({
          Bucket: this.bucketName,
          CopySource: `${this.bucketName}/${key}`,
          Key: newKey,
        }),
      );
    } catch (error) {
      this.logger.error('Failed to copy object to R2', error);
      throw error;
    }
  }
}
