import { Carousel } from "@pawpal/ui/carousel";
import CardCarousel from "../CardCarousel";
import classes from "./style.module.css";

const CAROUSEL_MOCKUP = [
  {
    id: 1,
    image: "carousel-1.jpg",
    title: "Promotion 10%",
    category: "Valorant",
    href: "/products/valorant",
  },
  {
    id: 2,
    image: "carousel-2.jpg",
    title: "Free Heirloom",
    category: "Apex Legends",
    href: "/products/apex-legends",
  },
  {
    id: 3,
    image: "carousel-3.jpg",
    title: "Free 10% of your purchase",
    category: "Fortnite",
    href: "/products/fortnite",
  },
  {
    id: 4,
    image: "carousel-4.jpg",
    title: "Get cashback 10%",
    category: null,
    href: null,
  },
];

const MainCarousel = () => {
  return (
    <Carousel
      classNames={classes}
      withControls={false}
      withIndicators={true}
      emblaOptions={{
        loop: true,
      }}
    >
      {CAROUSEL_MOCKUP.map((item) => (
        <Carousel.Slide key={item.id}>
          <CardCarousel {...item} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MainCarousel;
