import { WalletType } from "../enums/wallet";

type Decimal = any;
export interface Session {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  createdAt: string;
  userWallet: Record<WalletType, Decimal>;
  roles: string[];
}
