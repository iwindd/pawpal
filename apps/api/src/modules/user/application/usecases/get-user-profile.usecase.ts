import { SuspensionUtil } from '@/utils/suspensionUtil';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminUserResponse } from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<AdminUserResponse> {
    const { suspensions, ...user } = await this.prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        userType: true,
        roles: { select: { id: true, name: true } },
        userWallets: { select: { walletType: true, balance: true } },
        _count: { select: { orders: true } },
        suspensions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            type: true,
            note: true,
            createdAt: true,
            performedBy: { select: { id: true, displayName: true } },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isSuspension = SuspensionUtil.isSuspended(suspensions);

    return {
      ...user,
      userWallet: user.userWallets.reduce(
        (acc, w) => {
          acc[w.walletType as string] = w.balance;
          return acc;
        },
        {} as Record<string, any>,
      ),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      walletCount: 0,
      orderCount: user._count.orders,
      isSuspended: isSuspension,
      suspension: isSuspension
        ? {
            ...suspensions[0],
            createdAt: suspensions[0]?.createdAt?.toISOString(),
          }
        : null,
      userType: user.userType,
    };
  }
}
