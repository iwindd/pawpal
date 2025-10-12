import APISession from "@/libs/api/server";
import MainCarousel from "./components/MainCarousel";
import ProductSections from "./components/ProductSections";

export default async function HomePage() {
  const API = await APISession();
  const carouselResponse = await API.carousel.findAll();
  const carousels = carouselResponse.success ? carouselResponse.data : [];

  return (
    <>
      <MainCarousel carousels={carousels} />
      <ProductSections />
    </>
  );
}
