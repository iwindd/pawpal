import { FieldType } from "../../enums/field";
import { DiscountType } from "../../enums/sale";

export interface ProductSaleValue {
  discount: number;
  discountType: DiscountType;
  endAt: string | Date;
  startAt: string | Date;
  price?: number;
}

export interface ProductPackage {
  id: string;
  name: string;
  price: number;
  description?: string;
  sale?: ProductSaleValue;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductListItem {
  slug: string;
  name: string;
  sale: ProductSaleValue | null;
}

export interface ProductField {
  id: string;
  label: string;
  placeholder: string;
  type: FieldType;
  metadata: any;
  optional?: boolean;
}

export interface ProductResponse {
  slug: string;
  name: string;
  description?: string;
  createdAt: string | Date;
  category: ProductCategory;
  packages: ProductPackage[];
  fields: ProductField[];
  MOST_SALE: ProductSaleValue | null;
}

export interface AdminProductResponse {
  id: string;
  slug: string;
  name: string;
  description?: string;
  tags: {
    id: string;
    name: string;
  }[];
  categories: {
    id: string;
    name: string;
  }[];
  packageCount: number;
  image: {
    id: string;
    url: string;
  };
  createdAt: string;
}
