export enum ProductTagType {
  USER_DEFINED = "USER_DEFINED",
  SYSTEM = "SYSTEM",
}

export interface AdminProductTagResponse {
  id: string;
  slug: string;
  name: string;
  type: ProductTagType;
  createdAt: string | Date;
  updatedAt: string | Date;
}
