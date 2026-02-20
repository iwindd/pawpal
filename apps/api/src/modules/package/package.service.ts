import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageBulkInput, PackageInput, ProductField } from '@pawpal/shared';
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
        productId: productId,
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

  async bulkUpdatePackages(productId: string, payload: PackageBulkInput) {
    const { packages } = payload;
    const incomingIds = packages.filter((p) => p.id).map((p) => p.id);

    return await this.prisma.$transaction(async (tx) => {
      // 1. Delete packages not in the incoming list for this product
      // We only delete if there are incoming packages, or if the list is empty we delete all.
      await tx.package.deleteMany({
        where: {
          productId,
          NOT: {
            id: {
              in: incomingIds,
            },
          },
        },
      });

      // 2. Update existing & create new
      const results = [];
      let order = 0;
      for (const pkg of packages) {
        if (pkg.id) {
          // Update
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
          // Create
          const created = await tx.package.create({
            data: {
              name: pkg.name,
              price: pkg.price,
              description: pkg.description,
              order,
              product: {
                connect: { id: productId },
              },
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
