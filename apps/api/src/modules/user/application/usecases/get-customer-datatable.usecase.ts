import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { UserType } from '@/generated/prisma/enums';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCustomerDatatableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: DatatableQuery) {
    return this.prisma.user.getDatatable({
      query: query,
      where: {
        userType: UserType.CUSTOMER,
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
