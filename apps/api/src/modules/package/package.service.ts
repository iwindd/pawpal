import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AdminProductPackageResponse,
  DatatableResponse,
  PackageInput,
  ProductField,
} from '@pawpal/shared';
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

  async getProductPackages(
    productId: string,
    { skip, take, orderBy, search }: DatatableQuery,
  ): Promise<DatatableResponse<AdminProductPackageResponse>> {
    const where: Prisma.PackageWhereInput = {
      product_id: productId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const total = await this.prisma.package.count({ where });
    const packages = await this.prisma.package.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
    });

    return {
      total: total,
      data: packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price.toString(),
        createdAt: pkg.createdAt,
      })),
    };
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
