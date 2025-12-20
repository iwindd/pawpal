import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageInput, ProductField } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackageService {
  constructor(private readonly prisma: PrismaService) {}

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
                order: true,
                label: true,
                placeholder: true,
                metadata: true,
                type: true,
                optional: true,
              },
            },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('invalid_package');

    return product.product.fields;
  }

  /**
   * Get product packages datatable
   * @param productId
   * @param query
   * @returns
   */
  async getProductPackageDatatable(productId: string, query: DatatableQuery) {
    return this.prisma.package.getDatatable({
      query,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
      searchable: {
        name: {
          mode: 'insensitive',
        },
        description: {
          mode: 'insensitive',
        },
      },
      where: {
        product_id: productId,
      },
    });
  }

  async createPackageForProduct(productId: string, payload: PackageInput) {
    return await this.prisma.package.create({
      data: {
        ...payload,
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });
  }

  async update(packageId: string, payload: PackageInput) {
    return await this.prisma.package.update({
      where: {
        id: packageId,
      },
      data: {
        ...payload,
      },
    });
  }
}
