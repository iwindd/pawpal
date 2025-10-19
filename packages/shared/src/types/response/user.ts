interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  avatar: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  roles: {
    id: string;
    name: string;
  }[];
  walletCount: number;
  orderCount: number;
}

export interface AdminCustomerResponse extends UserResponse {}
export interface AdminEmployeeResponse extends UserResponse {}
