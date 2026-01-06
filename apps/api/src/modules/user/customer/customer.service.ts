import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get customer datatable
   * @param query
   * @returns
   */
  async getCustomerDatatable(query: DatatableQuery) {
    return this.prisma.user.getDatatable({
      query: query,
      where: {
        roles: {
          some: {
            name: 'User',
          },
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userWallets: true,
            orders: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      searchable: {
        email: { mode: 'insensitive' },
        displayName: { mode: 'insensitive' },
      },
    });
  }
}
