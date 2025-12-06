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

export interface ProductTag {
  slug: string;
  name: string;
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
  productTags: ProductTag[];
  packages: ProductPackage[];
  sales: ProductSaleValue | null;
  fields: ProductField[];
}

export interface AdminProductResponse {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt: string;
  category: ProductCategory;
  productTags: ProductTag[];
  packages: ProductPackage[];
  packageCount: number;
  image: {
    id: string;
    url: string;
  } | null;
}

export interface AdminProductEditResponse {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt: string;
  category: ProductCategory;
  productTags: ProductTag[];
  packages: ProductPackage[];
  image: {
    id: string;
    url: string;
  } | null;
}
