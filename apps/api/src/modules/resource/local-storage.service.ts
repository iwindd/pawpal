import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocalStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly storagePath = join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {
    this.ensureStoragePath();
  }

  private ensureStoragePath(): void {
    fs.mkdir(this.storagePath, { recursive: true }).catch(() => {});
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
    const filePath = join(this.storagePath, key);
    await fs.writeFile(filePath, file.buffer);

    this.logger.log(`Uploaded file "${key}"`);

    return {
      key,
    };
  }
}
