import { HomeLayoutStatus } from "../../enums/home-layout";
import { HomeLayoutSectionItem } from "../../schemas/website/home-layout";
import { AdminUserResponse } from "./user";

export interface AdminHomeLayoutResponse {
  id: string;
  version: number;
  name: string;
  status: HomeLayoutStatus;
  sections: HomeLayoutSectionItem[];
  updater?: AdminUserResponse;
  updatedAt: string;
  createdAt: string;
}

export interface HomeLayoutResponse {
  version: number;
  sections: HomeLayoutSectionItem[];
  updatedAt: string;
}
