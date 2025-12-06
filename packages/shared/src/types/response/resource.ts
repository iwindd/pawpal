import { ResourceType } from "../../enums/resource";

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
