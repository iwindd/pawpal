import { Role, WalletType } from "@pawpal/prisma";

export interface Session {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  createdAt: string;
  userWallet: Record<WalletType, number>;
  roles: Role["name"][];
}
