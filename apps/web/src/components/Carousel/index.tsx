"use client";
import { CarouselResponse } from "@pawpal/shared";
import { Autoplay, Carousel as CarouselUI } from "@pawpal/ui/carousel";
import { Group } from "@pawpal/ui/core";
import { useMediaQuery } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import CardCarousel from "./components/CardCarousel";
import classes from "./style.module.css";

interface CarouselProps {
  carousels: CarouselResponse[];
}

const getCarouselItems = (carousels: CarouselResponse[]) => {
  if (carousels.length == 2) {
    return [
      carousels[0]!,
      carousels[1]!,
      {
        ...carousels[0]!,
        id: carousels[0]!.id + "-clone",
      },
    ];
  }

  return carousels;
};

const Carousel = ({ carousels }: CarouselProps) => {
  const autoplay = useRef(Autoplay({ delay: 7000 }));
  const [items] = useState(getCarouselItems(carousels));
  const [activeIndex, setActiveIndex] = useState(0);
  const __ = useTranslations("Home.CardCarousel");

  const isSm = useMediaQuery("(max-width: 48em)");

  if (items.length === 0) return null;

  return (
    <Group className={classes.wrapper}>
      <CarouselUI
        classNames={classes}
        withControls={true}
        withIndicators={true}
        onSlideChange={setActiveIndex}
        slideSize={{ base: "100%", sm: "70%" }}
        slideGap={{ base: 0, sm: "lg" }}
        emblaOptions={{
          loop: true,
        }}
        plugins={[autoplay.current]}
      >
        {items.map((item, index) => (
          <CarouselUI.Slide
            key={item.id}
            style={{
              width: "100%",
              opacity: isSm ? 1 : activeIndex === index ? 1 : 0.2,
              transition: "opacity 0.5s ease",
            }}
          >
            <CardCarousel alt={item.title} src={item.image.url} />
          </CarouselUI.Slide>
        ))}
      </CarouselUI>
    </Group>
  );
};

export default Carousel;
