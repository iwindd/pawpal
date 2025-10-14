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

export interface AdminProductResponse {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
  category: ProductCategory;
  productTags: ProductTag[];
  packageCount: number;
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
}
