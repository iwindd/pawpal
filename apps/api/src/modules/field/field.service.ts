import { DatatableQuery } from '@/common/pipes/DatatablePipe';
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

  /**
   * Get product field datatable
   * @param productId
   * @param query
   * @returns
   */
  async getProductFieldDatatable(productId: string, query: DatatableQuery) {
    return this.prismaService.productField.getDatatable({
      query: {
        ...query,
        take: 100,
        skip: 0,
      },
      where: {
        productId: productId,
      },
      select: {
        id: true,
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
      searchable: {
        label: { mode: 'insensitive' },
        placeholder: { mode: 'insensitive' },
        creator: {
          displayName: { mode: 'insensitive' },
        },
      },
    });
  }

  async reorderProductField(
    productId: string,
    { fromIndex, toIndex, field_id }: FieldReorderInput,
  ) {
    const operator = fromIndex < toIndex ? 'decrement' : 'increment';
    const range =
      fromIndex < toIndex
        ? { gt: fromIndex, lte: toIndex }
        : { gte: toIndex, lt: fromIndex };

    await this.prismaService.$transaction(async () => {
      await this.prismaService.productField.updateMany({
        where: { order: range, productId: productId },
        data: { order: { [operator]: 1 } },
      });
      await this.prismaService.productField.update({
        where: { id: field_id, productId: productId },
        data: { order: toIndex },
      });
    });
  }

  async bulkUpdateFields(productId: string, payload: any, user: Session) {
    const { fields } = payload;
    const incomingIds = fields
      .filter((f: any) => f.id)
      .map((f: any) => f.id as string);

    return await this.prismaService.$transaction(async (tx) => {
      // 1. Delete fields not in the incoming list for this product
      await tx.productField.deleteMany({
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
      for (const field of fields) {
        if (field.id) {
          // Update
          const updated = await tx.productField.update({
            where: { id: field.id },
            data: {
              label: field.label,
              placeholder: field.placeholder,
              type: field.type as FieldType,
              optional: field.optional,
              metadata: this.parseMetadata(field),
              order,
            },
          });
          results.push(updated);
        } else {
          // Create
          const created = await tx.productField.create({
            data: {
              label: field.label,
              placeholder: field.placeholder,
              type: field.type as FieldType,
              optional: field.optional,
              metadata: this.parseMetadata(field),
              order,
              creator: {
                connect: { id: user.id },
              },
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
