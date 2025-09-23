export interface ProductSaleValue {
  percent: number;
  endAt: string;
  startAt: string;
}

export interface ProductResponse {
  slug: string;
  name: string;
  sales: ProductSaleValue | null;
}
