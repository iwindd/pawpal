import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageBulkInput, PackageInput, ProductField } from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { IPackageRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaPackageRepository implements IPackageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFields(packageId: string): Promise<ProductField[]> {
    const product = await this.prisma.package.findUnique({
      where: { id: packageId },
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

  async getProductPackageDatatable(productId: string, query: DatatableQuery) {
    return this.prisma.package.getDatatable({
      query: { ...query, skip: 0, take: 100 },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        createdAt: true,
      },
      searchable: {
        name: { mode: 'insensitive' },
        description: { mode: 'insensitive' },
      },
      where: { productId },
    });
  }

  async createPackageForProduct(productId: string, payload: PackageInput) {
    return this.prisma.package.create({
      data: {
        ...payload,
        product: { connect: { id: productId } },
      },
    });
  }

  async update(packageId: string, payload: PackageInput) {
    return this.prisma.package.update({
      where: { id: packageId },
      data: { ...payload },
    });
  }

  async bulkUpdatePackages(productId: string, payload: PackageBulkInput) {
    const { packages } = payload;
    const incomingIds = packages.filter((p) => p.id).map((p) => p.id);

    return this.prisma.$transaction(async (tx) => {
      await tx.package.deleteMany({
        where: { productId, NOT: { id: { in: incomingIds } } },
      });

      const results = [];
      let order = 0;
      for (const pkg of packages) {
        if (pkg.id) {
          const updated = await tx.package.update({
            where: { id: pkg.id },
            data: {
              name: pkg.name,
              price: pkg.price,
              description: pkg.description,
              order,
            },
          });
          results.push(updated);
        } else {
          const created = await tx.package.create({
            data: {
              name: pkg.name,
              price: pkg.price,
              description: pkg.description,
              order,
              product: { connect: { id: productId } },
            },
          });
          results.push(created);
        }
        order++;
      }
      return results;
    });
  }
}
