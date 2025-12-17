import { UserEntity } from '@/common/entities/user.entity';
import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateProfileInput } from '@pawpal/shared';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from '../wallet/repositories/wallet.repository';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRepo: WalletRepository,
  ) {}

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
    return new UserEntity(
      {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt,
        roles: user.roles,
        userWallets: await this.walletRepo.findAll(user.id),
      },
      this,
    );
  }

  /**
   * Find user by id
   * @param id user id
   * @returns user
   */
  public async find(id: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id },
      select: UserRepository.DEFAULT_SELECT,
    });

    return user ? this.from(user) : null;
  }

  /**
   * Find user by email
   * @param email user email
   * @returns user
   */
  public async findByEmail(email: string) {
    const user = await this.prisma.user.findFirstOrThrow({
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
  public async create(user: Prisma.UserCreateInput) {
    const newUser = await this.prisma.user.create({
      data: {
        ...user,
        password: await bcrypt.hash(user.password, 12),
      },
      select: UserRepository.DEFAULT_SELECT,
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
  public async updatePassword(userId: string, password: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(password, 12) },
    });
  }

  /**
   * Update user email
   * @param userId user id
   * @param email new email
   * @returns updated user
   */
  public async updateEmail(userId: string, email: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { email },
    });
  }

  /**
   * Update user profile
   * @param userId user id
   * @param payload update profile payload
   * @returns updated user
   */
  public async updateProfile(userId: string, payload: UpdateProfileInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: payload.displayName,
      },
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
