import { Prisma } from '@/generated/prisma/client';
import {
  DEFAULT_USER_SELECT,
  UserRepository,
} from '@/modules/user/user.repository';
import { Session, UpdateProfileInput, WalletType } from '@pawpal/shared';
import { Decimal } from '@prisma/client/runtime/client';

export type UserEntityProps = Prisma.UserGetPayload<{
  select: typeof DEFAULT_USER_SELECT;
}>;

export class UserEntity {
  constructor(
    private readonly user: UserEntityProps,
    private readonly repo: UserRepository,
  ) {}

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

  public get userWallet() {
    return this.user.userWallets.reduce(
      (acc, wallet) => {
        acc[wallet.walletType] = wallet.balance;
        return acc;
      },
      {} as Record<WalletType, Decimal>,
    );
  }

  public get roles() {
    return this.user.roles.map((role) => role.name);
  }

  public async isValidPassword(password: string) {
    return this.repo.isValidPassword(this.id, password);
  }

  public async updatePassword(password: string) {
    return this.repo.updatePassword(this.id, password);
  }

  public async updateEmail(email: string) {
    this.user.email = email;
    return this.repo.updateEmail(this.id, email);
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
      userWallet: this.userWallet,
      roles: this.roles,
    };
  }
}
