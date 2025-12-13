import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { loggingModelExtension } from './extensions/LoggingExtension';
import { PackageExtension } from './extensions/PackageExtension';
import { walletExtension } from './extensions/WalletExtension';
@Injectable()
export class PrismaProvider extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  withExtensions() {
    return this.$extends(loggingModelExtension)
      .$extends(PackageExtension)
      .$extends(walletExtension);
  }
}
