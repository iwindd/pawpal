import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentGatewayService {
  constructor(private readonly prisma: PrismaService) {}
  findAllActive() {
    return this.prisma.paymentGateway.findMany({
      where: { isActive: true },
      select: {
        id: true,
        label: true,
        text: true,
        isActive: true,
        order: true,
      },
    });
  }
}
