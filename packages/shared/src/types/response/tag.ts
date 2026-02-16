export enum TagType {
  USER_DEFINED = "USER_DEFINED",
  SYSTEM = "SYSTEM",
}

export interface AdminTagResponse {
  id: string;
  slug: string;
  name: string;
  type: TagType;
  createdAt: string | Date;
  updatedAt: string | Date;
}
