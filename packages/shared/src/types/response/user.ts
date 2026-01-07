import { Session } from "../session";

export interface AdminUserResponse extends Session {
  walletCount: number;
  orderCount: number;
}

export interface AdminCustomerResponse extends AdminUserResponse {}
export interface AdminEmployeeResponse extends AdminUserResponse {}
