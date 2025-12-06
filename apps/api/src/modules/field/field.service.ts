import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { Injectable } from '@nestjs/common';
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

  async createProductField(
    productId: string,
    payload: FieldInput,
    user: Session,
  ) {
    const field = await this.prismaService.productField.create({
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: this.parseMetadata(payload),
        creator: {
          connect: { id: user.id },
        },
        product: {
          connect: { id: productId },
        },
      },
    });

    return field;
  }

  update(id: string, payload: FieldInput) {
    return this.prismaService.productField.update({
      where: {
        id,
      },
      data: {
        label: payload.label,
        placeholder: payload.placeholder,
        type: payload.type as FieldType,
        optional: payload.optional,
        metadata: this.parseMetadata(payload),
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
              { label: { contains: search, mode: 'insensitive' } },
              { placeholder: { contains: search, mode: 'insensitive' } },
              {
                creator: {
                  displayName: { contains: search, mode: 'insensitive' },
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
      orderBy: orderBy,
      select: {
        id: true,
        order: true,
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
    });

    return {
      data: fields,
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
