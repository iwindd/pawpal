import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@pawpal/prisma';
import {
  FieldInput,
  FieldReorderInput,
  FieldType,
  Session,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FieldService {
  constructor(private readonly prismaService: PrismaService) {}

  private parseMetadata(payload: FieldInput) {
    const metadata = (payload as any).metadata || {};
    return {
      ...metadata,
    };
  }

  addToProduct(fieldId: string, productId: string) {
    return this.prismaService.productField.create({
      data: {
        field: {
          connect: { id: fieldId },
        },
        product: {
          connect: { id: productId },
        },
      },
    });
  }

  async create(payload: FieldInput, user: Session) {
    const products = Array.isArray(payload.products) ? payload.products : [];
    const field = await this.prismaService.field.create({
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: this.parseMetadata(payload),
        creator: {
          connect: { id: user.id },
        },
        products: {},
      },
    });

    if (!field) throw new Error('field_creation_failed');

    if (products.length > 0) {
      await this.prismaService.$transaction(async () => {
        for (const productId of products) {
          await this.prismaService.productField.create({
            data: {
              field: {
                connect: { id: field.id },
              },
              product: {
                connect: { id: productId },
              },
            },
          });
        }
      });
    }

    return field;
  }

  update(id: string, payload: FieldInput) {
    return this.prismaService.field.update({
      where: {
        id,
      },
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: this.parseMetadata(payload),
        products: {},
      },
    });
  }

  async getProductFields(
    productId: string,
    { skip, take, orderBy, search }: DatatableQuery,
  ) {
    const where: Prisma.ProductFieldWhereInput = {
      product_id: productId,
      ...(search
        ? {
            OR: [
              {
                field: {
                  label: { contains: search, mode: 'insensitive' },
                  placeholder: { contains: search, mode: 'insensitive' },
                  creator: {
                    displayName: { contains: search, mode: 'insensitive' },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const total = await this.prismaService.productField.count({ where });
    const fields = await this.prismaService.productField.findMany({
      where,
      skip,
      take,
      orderBy: orderBy as Prisma.FieldOrderByWithRelationInput,
      select: {
        id: true,
        order: true,
        field: {
          select: {
            label: true,
            placeholder: true,
            type: true,
            optional: true,
            metadata: true,
            createdAt: true,
            creator: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return {
      data: fields.map((pf) => ({
        id: pf.id,
        order: pf.order,
        ...pf.field,
      })),
      total: total,
    };
  }

  async reorderProductField(
    product_id: string,
    { fromIndex, toIndex, field_id }: FieldReorderInput,
  ) {
    const operator = fromIndex < toIndex ? 'decrement' : 'increment';
    const range =
      fromIndex < toIndex
        ? { gt: fromIndex, lte: toIndex }
        : { gte: toIndex, lt: fromIndex };

    await this.prismaService.$transaction(async () => {
      await this.prismaService.productField.updateMany({
        where: { order: range, product_id: product_id },
        data: { order: { [operator]: 1 } },
      });
      await this.prismaService.productField.update({
        where: { id: field_id, product_id: product_id },
        data: { order: toIndex },
      });
    });
  }
}
