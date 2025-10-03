import { ResourceType } from "@pawpal/prisma";

export interface ResourceResponse {
  id: string;
  url: string;
  createdAt: string;
  type: ResourceType;
  user: {
    id: string;
    displayName: string;
  };
}
