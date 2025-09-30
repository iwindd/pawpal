import { Injectable } from '@nestjs/common';

import { OrderStatus } from '@pawpal/prisma';
import { PurchaseInput } from '@pawpal/shared';
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
}
