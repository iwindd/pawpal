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

  async getGateway(id: string) {
    return this.prisma.paymentGateway.findUniqueOrThrow({
      where: {
        id: id,
        isActive: true,
      },
      select: {
        id: true,
        metadata: true,
      },
    });
  }

  async isActive(id: string) {
    const gateway = await this.prisma.paymentGateway.findUnique({
      where: { id },
      select: { isActive: true },
    });

    return gateway?.isActive;
  }
}
