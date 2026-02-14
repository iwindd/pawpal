import { UserEntity } from '@/common/entities/user.entity';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import {
  AuditActionType,
  Prisma,
  UserSecurityEvent,
} from '@/generated/prisma/client';
import { ModelName } from '@/generated/prisma/internal/prismaNamespace';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateProfileInput } from '@pawpal/shared';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return {
      ...UserEntity.SELECT,
    } satisfies Prisma.UserSelect;
  }

  /**
   * Create a UserEntity from a Prisma.UserGetPayload
   * @param user Prisma.UserGetPayload
   * @returns UserEntity
   */
  public async from(
    user: Prisma.UserGetPayload<{
      select: typeof UserRepository.DEFAULT_SELECT;
    }>,
  ) {
    return new UserEntity(user, this);
  }

  /**
   * Find user by id
   * @param id user id
   * @returns user | null
   */
  public async find(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: UserRepository.DEFAULT_SELECT,
    });

    if (!user) return null;

    return this.from(user);
  }

  /**
   * Get user by id
   * @param id user id
   * @returns user
   */
  public async getUserById(id: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id },
      select: UserRepository.DEFAULT_SELECT,
    });

    return this.from(user);
  }

  /**
   * Find user by email
   * @param email user email
   * @returns user
   */
  public async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: UserRepository.DEFAULT_SELECT,
    });

    return user ? this.from(user) : null;
  }

  /**
   * Create a new user
   * @param user user payload
   * @returns user
   */
  public async create(
    user: Prisma.UserCreateInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const newUser = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          ...user,
          password: await bcrypt.hash(user.password, 12),
        },
        select: UserRepository.DEFAULT_SELECT,
      });

      await tx.auditLog.create({
        data: {
          modelName: ModelName.User,
          recordId: createdUser.id,
          action: AuditActionType.CREATED,
          newData: {
            displayName: createdUser.displayName,
            email: createdUser.email,
          },
          performedById: auditInfo?.performedById || createdUser.id,
          ipAddress: auditInfo?.ipAddress,
          userAgent: auditInfo?.userAgent,
        },
      });

      return createdUser;
    });

    return this.from(newUser);
  }

  /**
   * Check if the password is valid
   * @param userId user id
   * @param password password to check
   * @returns true if the password is valid, false otherwise
   */
  public async isValidPassword(userId: string, password: string) {
    const userPassword = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    return await bcrypt.compare(password, userPassword.password);
  }

  /**
   * Update user password
   * @param userId user id
   * @param password new password
   * @returns updated user
   */
  public async updatePassword(
    userId: string,
    password: string,
    auditInfo?: PrismaAuditInfo,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { password: await bcrypt.hash(password, 12) },
      });

      await tx.userSecurityLog.create({
        data: {
          userId,
          eventType: UserSecurityEvent.PASSWORD_CHANGED,
          performedById: auditInfo?.performedById || userId,
          ipAddress: auditInfo?.ipAddress,
          userAgent: auditInfo?.userAgent,
        },
      });

      return updatedUser;
    });
  }

  /**
   * Update user email
   * @param userId user id
   * @param email new email
   * @returns updated user
   */
  public async updateEmail(
    userId: string,
    email: string,
    auditInfo?: PrismaAuditInfo,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { email: true },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { email },
      });

      await tx.userSecurityLog.create({
        data: {
          userId,
          eventType: UserSecurityEvent.EMAIL_CHANGED,
          oldEmail: user.email,
          newEmail: email,
          performedById: auditInfo?.performedById || userId,
          ipAddress: auditInfo?.ipAddress,
          userAgent: auditInfo?.userAgent,
        },
      });

      return updatedUser;
    });
  }

  /**
   * Update user profile
   * @param userId user id
   * @param payload update profile payload
   * @returns updated user
   */
  public async updateProfile(
    userId: string,
    payload: UpdateProfileInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { displayName: true },
      });

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          displayName: payload.displayName,
        },
      });

      await tx.auditLog.create({
        data: {
          modelName: ModelName.User,
          recordId: updatedUser.id,
          action: AuditActionType.UPDATED,
          oldData: {
            displayName: user.displayName,
          },
          newData: {
            displayName: payload.displayName,
          },
          performedById: auditInfo?.performedById || updatedUser.id,
          ipAddress: auditInfo?.ipAddress,
          userAgent: auditInfo?.userAgent,
        },
      });

      return updatedUser;
    });
  }

  /**
   * Check if the email is already exist
   * @param email email to check
   * @returns true if the email is already exist, false otherwise
   */
  public async isAlreadyExist(email: string) {
    return (
      (await this.prisma.user.count({
        where: { email },
      })) > 0
    );
  }
}
