import { OrderStatus } from '@/generated/prisma/enums';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class NoProgressGuard implements CanActivate {
  private readonly logger = new Logger(NoProgressGuard.name);
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const userId = req.user?.id ?? req.session?.userId;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const [hasWorkingOrder, orderCount] = await this.hasWorkingOrder(userId);
    const [hasWorkingTransaction, transactionCount] =
      await this.hasWorkingTransaction(userId);

    if (hasWorkingOrder || hasWorkingTransaction) {
      this.logger.warn(
        `User ${userId} has working order or transaction [${orderCount}, ${transactionCount}]`,
      );

      throw new ConflictException('is_in_progress');
    }

    return true;
  }

  /**
   * Check if user has working order
   * @param userId user id
   * @returns boolean
   */
  public async hasWorkingOrder(userId: string) {
    const workingOrder = await this.prisma.order.count({
      where: {
        user_id: userId,
        status: {
          in: [OrderStatus.CREATED, OrderStatus.PENDING],
        },
      },
    });

    return [!!workingOrder, workingOrder];
  }

  /**
   * Check if user has working transaction
   * @param userId user id
   * @returns boolean
   */
  public async hasWorkingTransaction(userId: string) {
    const workingTransaction = await this.prisma.userWalletTransaction.count({
      where: {
        wallet: {
          userId: userId,
        },
        status: {
          in: [OrderStatus.CREATED, OrderStatus.PENDING],
        },
      },
    });

    return [!!workingTransaction, workingTransaction];
  }
}
