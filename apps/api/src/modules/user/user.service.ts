import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user datatable
   * @param query
   * @returns
   */
  async getUserDatatable(query: DatatableQuery) {
    return this.prisma.user.getDatatable({
      query: {
        ...query,
        where: {
          roles: {
            some: {
              name: 'User',
            },
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
      search: {
        email: 'insensitive',
        displayName: 'insensitive',
      },
    });
  }

  /**
   * Get employee datatable
   * @param query
   * @returns
   */
  async getEmployeeDatatable(query: DatatableQuery) {
    return this.prisma.user.getDatatable({
      query: {
        ...query,
        where: {
          roles: {
            some: {
              name: 'Admin',
            },
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
      search: {
        email: 'insensitive',
        displayName: 'insensitive',
      },
    });
  }
}
