import { Prisma } from '@/generated/prisma/client';
import { UserRepository } from '@/modules/user/user.repository';
import { Session, UpdateProfileInput } from '@pawpal/shared';
import { WalletCollection } from '../collections/wallet.collection';

export type UserEntityProps = Prisma.UserGetPayload<{
  select: typeof UserEntity.SELECT;
}> & {
  userWallets: WalletCollection;
};

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
      roles: true,
    } satisfies Prisma.UserSelect;
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

  public get userWallet() {
    return this.user.userWallets.toObject();
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
