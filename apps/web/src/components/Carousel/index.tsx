"use client";
import { CarouselResponse } from "@pawpal/shared";
import { Autoplay, Carousel as CarouselUI } from "@pawpal/ui/carousel";
import { Group } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import CardCarousel from "./components/CardCarousel";
import classes from "./style.module.css";

interface CarouselProps {
  carousels: CarouselResponse[];
}

const Carousel = ({ carousels }: CarouselProps) => {
  const autoplay = useRef(Autoplay({ delay: 7000 }));
  const [items] = useState(carousels);
  const [activeIndex, setActiveIndex] = useState(0);
  const __ = useTranslations("Home.CardCarousel");

  if (items.length === 0) return null;

  return (
    <Group className={classes.wrapper}>
      <CarouselUI
        classNames={classes}
        withControls={false}
        withIndicators={true}
        onSlideChange={setActiveIndex}
        emblaOptions={{
          loop: true,
        }}
        plugins={[autoplay.current]}
      >
        {items.map((item) => (
          <CarouselUI.Slide key={item.id} style={{ width: "100%" }}>
            <CardCarousel alt={item.title} src={item.image.url} />
          </CarouselUI.Slide>
        ))}
      </CarouselUI>
    </Group>
  );
};

export default Carousel;
