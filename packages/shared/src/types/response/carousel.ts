import { CarouselStatus } from "../../schemas/website/carousel";

export interface CarouselResponse {
  id: string;
  title: string;
  product: {
    id: string;
    slug: string;
    name: string;
  };
  image: {
    id: string;
    url: string;
  };
  creator: {
    id: string;
    displayName: string;
  };
  status: CarouselStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  order: number;
}
