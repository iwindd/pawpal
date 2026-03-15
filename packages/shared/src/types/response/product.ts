import { FieldType } from "../../enums/field";
import { DiscountType } from "../../enums/sale";

export enum ProductType {
  GAME = "GAME",
  CARD = "CARD",
}

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
  id?: string;
  name: string;
  slug: string;
}

export interface ProductPlatform {
  id: string;
  name: string;
  slug: string;
}

export interface ProductFilterOption {
  label: string;
  value: string;
}

export interface ProductCategoryFilterOption extends ProductFilterOption {
  type?: ProductType;
}

export interface ProductFiltersResponse {
  types: ProductFilterOption[];
  platforms: ProductFilterOption[];
  categories: ProductCategoryFilterOption[];
  tags: ProductFilterOption[];
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
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt: string | Date;
  type?: ProductType;
  category: ProductCategory;
  categories?: ProductCategory[];
  productTags?: ProductTag[];
  platforms?: ProductPlatform[];
  packages: ProductPackage[];
  fields: ProductField[];
  MOST_SALE: ProductSaleValue | null;
  isStockTracked: boolean;
  stock: number;
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
  isStockTracked?: boolean;
  stock?: number;
}
