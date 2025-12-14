import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PackageEntity } from './package.entity';

export const DEFAULT_PACKAGE_SELECT = {
  id: true,
} satisfies Prisma.PackageSelect;

@Injectable()
export class PackageRepository {
  private readonly logger = new Logger(PackageRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a PackageEntity from a Prisma.PackageGetPayload
   * @param productPackage Prisma.PackageGetPayload
   * @returns PackageEntity
   */
  public from(
    productPackage: Prisma.PackageGetPayload<{
      select: typeof DEFAULT_PACKAGE_SELECT;
    }>,
  ) {
    return new PackageEntity(productPackage, this);
  }

  /**
   * Find a package by id
   * @param packageId package id
   * @returns PackageEntity
   */
  public async find(packageId: string) {
    const productPackage = await this.prisma.package.findFirstOrThrow({
      where: {
        id: packageId,
      },
      select: DEFAULT_PACKAGE_SELECT,
    });

    return this.from(productPackage);
  }
}
