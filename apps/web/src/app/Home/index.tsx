import MainCarousel from "./components/MainCarousel";
import ProductSections from "./components/ProductSections";

export default function Home(): React.JSX.Element {
  return (
    <>
      <MainCarousel />
      <ProductSections />
    </>
  );
}
