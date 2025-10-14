import { Injectable } from '@nestjs/common';

import { OrderStatus } from '@pawpal/prisma';
import {
  AdminOrderResponse,
  DatatableQueryDto,
  DatatableResponse,
  PurchaseInput,
} from '@pawpal/shared';
import { PackageService } from '../package/package.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly packageService: PackageService,
  ) {}

  async getProductPackage(packageId: string) {
    return this.prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });
  }

  async createOrder(userId: string, body: PurchaseInput) {
    const pkg = await this.packageService.getPackage(body.packageId);
    const price = +pkg.price;
    const amount = +body.amount;
    const total = price * amount;

    const order = await this.prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        total: total.toString(),
        status: OrderStatus.PENDING_PAYMENT,
        orderPackages: {
          create: {
            package: {
              connect: {
                id: pkg.id,
              },
            },
            amount: amount,
            price: price.toString(),
          },
        },
      },
    });

    return order;
  }

  async getOrdersForAdmin(
    queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<AdminOrderResponse>> {
    const { page, limit, search, sort } = queryParams;
    const skip = (page - 1) * limit;

    const where = {
      status: {
        in: [OrderStatus.PAID, OrderStatus.PROCESSING],
      },
      ...(search && {
        OR: [
          {
            user: {
              email: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            user: {
              displayName: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
        ],
      }),
    };

    const orderBy = {
      [sort.columnAccessor]: sort.direction,
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
            },
          },
          orderPackages: {
            include: {
              package: {
                include: {
                  product: {
                    include: {
                      category: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => ({
        ...order,
        total: order.total.toString(),
        orderPackages: order.orderPackages.map((op) => ({
          ...op,
          price: op.price.toString(),
        })),
      })) as AdminOrderResponse[],
      total,
    };
  }

  async findOne(id: string): Promise<AdminOrderResponse> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
        orderPackages: {
          include: {
            package: {
              include: {
                product: {
                  include: {
                    category: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      ...order,
      total: order.total.toString(),
      orderPackages: order.orderPackages.map((op) => ({
        ...op,
        price: op.price.toString(),
      })),
    } as AdminOrderResponse;
  }
}
