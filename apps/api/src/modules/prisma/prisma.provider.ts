import { Injectable } from '@nestjs/common';
import { PrismaClient, PrismaPg } from '@pawpal/prisma';
import { loggingModelExtension } from './extensions/LoggingExtension';
import { packageSaleExtension } from './extensions/PackageExtension';

@Injectable()
export class PrismaProvider extends PrismaClient {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
  }

  withExtensions() {
    return this.$extends(loggingModelExtension).$extends(packageSaleExtension);
  }
}
