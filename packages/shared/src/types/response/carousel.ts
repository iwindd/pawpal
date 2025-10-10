export interface CarouselResponse {
  id: string;
  title: string;
  product: {
    id: string;
    name: string;
  };
  image: {
    id: string;
    url: string;
  };
}
