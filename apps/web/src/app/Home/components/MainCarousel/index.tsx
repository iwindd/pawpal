import { Carousel } from "@pawpal/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import CardCarousel from "../CardCarousel";
import classes from "./style.module.css";

const CAROUSEL_MOCKUP = [
  {
    id: 1,
    image: "fallback-carousel.jpg",
    title: "Promotion 10%",
    category: "Valorant",
    href: "/products/valorant",
  },
  {
    id: 2,
    image: "fallback-carousel.jpg",
    title: "Free Heirloom",
    category: "Apex Legends",
    href: "/products/apex-legends",
  },
  {
    id: 3,
    image: "fallback-carousel.jpg",
    title: "Free 10% of your purchase",
    category: "Fortnite",
    href: "/products/fortnite",
  },
  {
    id: 4,
    image: "fallback-carousel.jpg",
    title: "Get cashback 10%",
    category: null,
    href: null,
  },
];

const MainCarousel = () => {
  const autoplay = useRef(Autoplay({ delay: 7000 }));

  return (
    <Carousel
      classNames={classes}
      withControls={false}
      withIndicators={true}
      emblaOptions={{
        loop: true,
      }}
      plugins={[autoplay.current]}
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
