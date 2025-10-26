import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@pawpal/prisma';
import { loggingModelExtension } from './extensions/LoggingExtension';
import { packageSaleExtension } from './extensions/PackageExtension';

@Injectable()
export class PrismaProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static initialized = false;

  async onModuleInit() {
    if (!PrismaProvider.initialized) {
      PrismaProvider.initialized = true;
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (PrismaProvider.initialized) {
      PrismaProvider.initialized = false;
      await this.$disconnect();
    }
  }

  withExtensions() {
    return this.$extends(loggingModelExtension).$extends(packageSaleExtension);
  }
}
