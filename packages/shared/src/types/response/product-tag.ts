import { Product, ProductTags, Sale } from "@pawpal/prisma";

export interface SaleValueResponse {
  percent: Sale["discount"] | number;
  endAt: Sale["endAt"];
  startAt: Sale["startAt"];
}

export interface ProductTagResponse {
  slug: ProductTags["slug"];
  name: ProductTags["name"];
  products: {
    slug: Product["slug"];
    name: Product["name"];
    sales: SaleValueResponse | null;
  }[];
}
