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
      query: query,
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
}
