import { CloudflareUtil } from '@/utils/cloudflareUtil';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);
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
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * Uploads a file to R2 storage.
   * @param file The file to upload.
   * @returns A promise that resolves to an object containing the key and URL of the uploaded file.
   */
  public async uploadResourceImage(file: Express.Multer.File) {
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
      return {
        key,
      };
    } catch (error) {
      this.logger.error('Failed to upload file to R2', error);
      throw error;
    }
  }
}
