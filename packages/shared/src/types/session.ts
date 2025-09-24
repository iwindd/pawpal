export interface Session {
  id: string;
  email: string;
  displayName: string;
  coins: number;
  avatar: string | null;
  createdAt: string;
}
