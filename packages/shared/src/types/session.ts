import { WalletType } from "../enums/wallet";

type Decimal = any;
export interface Session {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  userWallet: Record<WalletType, Decimal>;
  roles: {
    id: string;
    name: string;
  }[];
}
