import { UserSuspensionType } from "../../enums/suspension";
import { Session } from "../session";

export interface AdminUserResponse extends Session {
  walletCount: number;
  orderCount: number;
  suspension: {
    type: UserSuspensionType;
    note: string;
    createdAt: string;
    performedBy: {
      id: string;
      displayName: string;
    };
  };
}

export interface AdminCustomerResponse extends AdminUserResponse {}
export interface AdminEmployeeResponse extends AdminUserResponse {}

export interface AdminUserSuspensionResponse {
  id: string;
  type: UserSuspensionType;
  note: string | null;
  createdAt: string;
  performedBy: {
    id: string;
    displayName: string;
  };
}
