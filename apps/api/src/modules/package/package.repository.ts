import { PackageEntity } from '@/common/entities/package.entity';
import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackageRepository {
  private readonly logger = new Logger(PackageRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return PackageEntity.SELECT satisfies Prisma.PackageSelect;
  }

  /**
   * Create a PackageEntity from a Prisma.PackageGetPayload
   * @param productPackage Prisma.PackageGetPayload
   * @returns PackageEntity
   */
  public from(
    productPackage: Prisma.PackageGetPayload<{
      select: typeof PackageRepository.DEFAULT_SELECT;
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
      select: PackageRepository.DEFAULT_SELECT,
    });

    return this.from(productPackage);
  }
}
