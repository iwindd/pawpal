export interface ProductSaleValue {
  percent: number;
  endAt: string;
  startAt: string;
}

export interface ProductPackage {
  id: string;
  name: string;
  price: number;
  description?: string;
  sale?: ProductSaleValue;
}

export interface ProductCategory {
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
  sales: ProductSaleValue | null;
}

export interface ProductResponse {
  slug: string;
  name: string;
  description?: string;
  createdAt: string;
  category: ProductCategory;
  productTags: ProductTag[];
  packages: ProductPackage[];
  sales: ProductSaleValue | null;
}
