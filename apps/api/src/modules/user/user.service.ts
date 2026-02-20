import { WalletCollection } from '@/common/collections/wallet.collection';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { SuspensionUtil } from '@/utils/suspensionUtil';
import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AdminCreateUserInput,
  AdminUserResponse,
  ChangeEmailInput,
  UpdateProfileInput,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Admin create a new user
   * @param payload admin create user payload
   * @param auditInfo audit info
   * @returns created user session
   */
  async adminCreateUser(
    payload: AdminCreateUserInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    if (await this.userRepo.isAlreadyExist(payload.email))
      throw new ConflictException('email_already_exists');

    const roleConnections =
      payload.type === 'employee' && payload.roles.length > 0
        ? payload.roles.map((name) => ({ name }))
        : [{ name: 'User' }];

    const user = await this.userRepo.create(
      {
        displayName: payload.displayName,
        email: payload.email,
        password: payload.password,
        roles: {
          connect: roleConnections,
        },
      },
      auditInfo,
    );

    return user.toJSON();
  }
  /**
   * Change user email
   * @param userId user id
   * @param payload change email payload
   * @returns user session
   */
  async changeEmail(
    userId: string,
    payload: ChangeEmailInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const isAlreadyExist = await this.userRepo.isAlreadyExist(payload.newEmail);

    if (isAlreadyExist) throw new ConflictException('email_already_exists');

    const user = await this.userRepo.find(userId);

    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isValidPassword = await user.isValidPassword(payload.password);

    if (!isValidPassword)
      throw new UnauthorizedException('invalid_old_password');

    await user.updateEmail(payload.newEmail, auditInfo);

    return user.toJSON();
  }

  /**
   * Update user profile
   * @param userId user id
   * @param updateProfileData update profile data
   * @returns user session
   */
  async updateProfile(
    userId: string,
    payload: UpdateProfileInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const user = await this.userRepo.find(userId);
    await user.updateProfile(payload, auditInfo);

    return user.toJSON();
  }

  /**
   * Admin reset user email
   * @param userId user id
   * @param email new email
   * @returns user session
   */
  async adminResetEmail(
    userId: string,
    email: string,
    auditInfo?: PrismaAuditInfo,
  ) {
    const isAlreadyExist = await this.userRepo.isAlreadyExist(email);

    if (isAlreadyExist) throw new ConflictException('email_already_exists');

    await this.userRepo.updateEmail(userId, email, auditInfo);

    return { success: true };
  }

  /**
   * Admin reset user password
   * @param userId user id
   * @param password new password
   * @returns user session
   */
  async adminResetPassword(
    userId: string,
    password: string,
    auditInfo?: PrismaAuditInfo,
  ) {
    await this.userRepo.updatePassword(userId, password, auditInfo);

    return { success: true };
  }

  /**
   * Get user profile
   * @param userId user id
   * @returns user session
   */
  async getProfile(userId: string): Promise<AdminUserResponse> {
    const { suspensions, ...user } = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        userWallets: {
          select: {
            walletType: true,
            balance: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
        suspensions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            type: true,
            note: true,
            createdAt: true,
            performedBy: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isSuspension = SuspensionUtil.isSuspended(suspensions);

    return {
      ...user,
      userWallet: WalletCollection.toObject(user.userWallets),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      walletCount: 0, // TODO: WHAT DA HELL IS THIS?
      orderCount: user._count.orders,
      isSuspended: isSuspension,
      suspension: isSuspension
        ? {
            ...suspensions[0],
            createdAt: suspensions[0]?.createdAt?.toISOString(),
          }
        : null,
    };
  }

  /**
   * Suspend a user
   * @param id user id
   * @param adminId admin id who performed the action
   * @param note optional note
   */
  async suspendUser(id: string, adminId: string, note?: string) {
    return this.prisma.userSuspension.create({
      data: {
        userId: id,
        performedById: adminId,
        type: 'SUSPENDED',
        note,
      },
    });
  }

  /**
   * Unsuspend a user
   * @param id user id
   * @param adminId admin id who performed the action
   * @param note optional note
   */
  async unsuspendUser(id: string, adminId: string, note?: string) {
    return this.prisma.userSuspension.create({
      data: {
        userId: id,
        performedById: adminId,
        type: 'UNSUSPENDED',
        note,
      },
    });
  }

  /**
   * Get suspension history datatable
   * @param userId user id
   * @param query datatable query
   * @returns datatable response
   */
  async getSuspensionHistoryDatatable(userId: string, query: DatatableQuery) {
    return this.prisma.userSuspension.getDatatable({
      query: query,
      where: {
        userId,
      },
      select: {
        id: true,
        type: true,
        note: true,
        createdAt: true,
        performedBy: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });
  }
}
