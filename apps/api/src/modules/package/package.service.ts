import { Injectable, NotFoundException } from '@nestjs/common';
import { Package } from '@pawpal/prisma';
import { ProductField } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService) {}

  async getPackage(packageId: string): Promise<Package> {
    const pkg = await this.prisma.package.findFirst({
      where: {
        id: packageId,
      },
    });

    if (!pkg) throw new NotFoundException('invalid_package');
    return pkg;
  }

  async getFields(packageId: string): Promise<ProductField[]> {
    const product = await this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
      select: {
        product: {
          select: {
            fields: {
              select: {
                id: true,
                label: true,
                placeholder: true,
                metadata: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('invalid_package');

    return product.product.fields;
  }
}
