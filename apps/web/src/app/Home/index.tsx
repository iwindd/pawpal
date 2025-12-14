import Carousel from "@/components/Carousel";
import APISession from "@/libs/api/server";
import ProductSections from "./components/ProductSections";

export default async function HomePage() {
  const API = await APISession();
  const carouselResponse = await API.carousel.findAll();
  const carousels = carouselResponse.success ? carouselResponse.data : [];

  return (
    <>
      <Carousel carousels={carousels} />
      <ProductSections />
    </>
  );
}
