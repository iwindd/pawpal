import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@pawpal/prisma';
import { FieldInput, FieldType, Session } from '@pawpal/shared';
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

  create(payload: FieldInput, user: Session) {
    const products = Array.isArray(payload.products) ? payload.products : [];
    return this.prismaService.field.create({
      data: {
        ...payload,
        type: payload.type as FieldType,
        metadata: this.parseMetadata(payload),
        creator: {
          connect: { id: user.id },
        },
        products: {
          connect: products.map((productId) => ({ id: productId })),
        },
      },
    });
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
    const where: Prisma.FieldWhereInput = {
      products: {
        some: {
          id: productId,
        },
      },
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

    const total = await this.prismaService.field.count({ where });
    const fields = await this.prismaService.field.findMany({
      where,
      skip,
      take,
      orderBy: orderBy as Prisma.FieldOrderByWithRelationInput,
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
    });

    return {
      data: fields,
      total: total,
    };
  }
}
