export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isFlashsale?: boolean;
  flashsaleEndTime?: string;
  tags: string[];
}

export type ProductType = "flashsale" | "popular" | "new" | "latest";
