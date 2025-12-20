import cloudflareConfig from '@/config/cloudflare';
import { Logger } from '@nestjs/common';

export class CloudflareUtil {
  static readonly logger = new Logger(CloudflareUtil.name);

  static getR2Path(
    path: keyof typeof cloudflareConfig.r2Storage.paths,
    fileName: string,
  ) {
    if (!cloudflareConfig.r2Storage.paths[path]) {
      this.logger.error('invalid_storage_path');
      throw new Error('invalid_storage_path');
    }

    return `${cloudflareConfig.r2Storage.paths[path]}/${fileName}`;
  }
}
