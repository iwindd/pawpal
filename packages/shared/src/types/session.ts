import { WalletType } from "../enums/wallet";

export interface Session {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  createdAt: string;
  userWallet: Record<WalletType, number>;
  roles: string[];
}
