import { Prisma } from '@/generated/prisma/client';
import { UserRepository } from '@/modules/user/user.repository';
import { Session, UpdateProfileInput } from '@pawpal/shared';
import { WalletCollection } from '../collections/wallet.collection';
import { PrismaAuditInfo } from '../interfaces/prisma-audit.interface';

export type UserEntityProps = Prisma.UserGetPayload<{
  select: typeof UserEntity.SELECT;
}>;

export class UserEntity {
  constructor(
    private readonly user: UserEntityProps,
    private readonly repo: UserRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      email: true,
      displayName: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
      roles: true,
      userWallets: {
        select: {
          walletType: true,
          balance: true,
        },
      },
      suspensions: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    } satisfies Prisma.UserSelect;
  }

  public get isSuspended() {
    const lastSuspension = this.user.suspensions?.[0];
    return lastSuspension?.type === 'SUSPENDED';
  }

  public get id() {
    return this.user.id;
  }

  public get email() {
    return this.user.email;
  }

  public get displayName() {
    return this.user.displayName;
  }

  public get avatar() {
    return this.user.avatar;
  }

  public get createdAt() {
    return this.user.createdAt;
  }

  public get updatedAt() {
    return this.user.updatedAt;
  }

  public get userWallet() {
    return WalletCollection.toObject(this.user.userWallets);
  }

  public get roles() {
    return this.user.roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  public async isValidPassword(password: string) {
    return this.repo.isValidPassword(this.id, password);
  }

  public async updatePassword(password: string, auditInfo?: PrismaAuditInfo) {
    return this.repo.updatePassword(this.id, password, auditInfo);
  }

  public async updateEmail(email: string, auditInfo?: PrismaAuditInfo) {
    this.user.email = email;
    return this.repo.updateEmail(this.id, email, auditInfo);
  }

  public async updateProfile(payload: UpdateProfileInput) {
    this.user.displayName = payload.displayName;
    return this.repo.updateProfile(this.id, payload);
  }

  toJSON(): Session {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      avatar: this.avatar,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      userWallet: this.userWallet,
      roles: this.roles,
      isSuspended: this.isSuspended,
    };
  }
}
