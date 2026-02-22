import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import {
  FieldInput,
  FieldReorderInput,
  FieldType,
  Session,
} from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { IFieldRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaFieldRepository implements IFieldRepository {
  constructor(private readonly prisma: PrismaService) {}

  private parseMetadata(payload: FieldInput) {
    const metadata = (payload as any).metadata || {};
    return { ...metadata };
  }

  async createProductField(
    productId: string,
    payload: FieldInput,
    user: Session,
  ) {
    return this.prisma.productField.create({
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: this.parseMetadata(payload),
        creator: { connect: { id: user.id } },
        product: { connect: { id: productId } },
      },
    });
  }

  async update(id: string, payload: FieldInput) {
    return this.prisma.productField.update({
      where: { id },
      data: {
        label: payload.label,
        placeholder: payload.placeholder,
        type: payload.type as FieldType,
        optional: payload.optional,
        metadata: this.parseMetadata(payload),
      },
    });
  }

  async getProductFieldDatatable(productId: string, query: DatatableQuery) {
    return this.prisma.productField.getDatatable({
      query: { ...query, take: 100, skip: 0 },
      where: { productId },
      select: {
        id: true,
        label: true,
        placeholder: true,
        type: true,
        optional: true,
        metadata: true,
        createdAt: true,
        creator: { select: { id: true, displayName: true } },
      },
      searchable: {
        label: { mode: 'insensitive' },
        placeholder: { mode: 'insensitive' },
        creator: { displayName: { mode: 'insensitive' } },
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

    await this.prisma.$transaction(async () => {
      await this.prisma.productField.updateMany({
        where: { order: range, productId },
        data: { order: { [operator]: 1 } },
      });
      await this.prisma.productField.update({
        where: { id: field_id, productId },
        data: { order: toIndex },
      });
    });
  }

  async bulkUpdateFields(productId: string, payload: any, user: Session) {
    const { fields } = payload;
    const incomingIds = fields
      .filter((f: any) => f.id)
      .map((f: any) => f.id as string);

    return this.prisma.$transaction(async (tx) => {
      await tx.productField.deleteMany({
        where: { productId, NOT: { id: { in: incomingIds } } },
      });

      const results = [];
      let order = 0;
      for (const field of fields) {
        if (field.id) {
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
          const created = await tx.productField.create({
            data: {
              label: field.label,
              placeholder: field.placeholder,
              type: field.type as FieldType,
              optional: field.optional,
              metadata: this.parseMetadata(field),
              order,
              creator: { connect: { id: user.id } },
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
