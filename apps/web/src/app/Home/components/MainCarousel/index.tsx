"use client";
import { CarouselResponse } from "@pawpal/shared";
import { Autoplay, Carousel } from "@pawpal/ui/carousel";
import { Box, Button, Flex, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef, useState } from "react";
import CardCarousel from "../CardCarousel";
import classes from "./style.module.css";

interface MainCarouselProps {
  carousels: CarouselResponse[];
}

const MainCarousel = ({ carousels }: MainCarouselProps) => {
  const autoplay = useRef(Autoplay({ delay: 7000 }));
  const [items] = useState(carousels);
  const [activeIndex, setActiveIndex] = useState(0);
  const __ = useTranslations("Home.CardCarousel");

  console.log(carousels);

  const currentItem = items[activeIndex];

  return (
    <Group className={classes.wrapper}>
      <Group className={`${classes.overlay} ${classes.fader}`}>
        <Box className={classes.content}>
          <Flex className={classes.flex}>
            <Stack gap={0} className={classes.carouselMessage} justify="end">
              <Text className={classes.category} size="xs" m="0">
                {currentItem?.product?.name}
              </Text>
              <Title order={3} className={classes.title} m="0">
                {currentItem?.title}
              </Title>
            </Stack>
            <Box>
              {currentItem?.product && (
                <Button
                  component={Link}
                  variant="primary"
                  mt={"md"}
                  className={classes.button}
                  href={`/products/${currentItem.product.slug}`}
                  px={"xl"}
                >
                  {__("topup")}
                </Button>
              )}
            </Box>
          </Flex>
        </Box>
      </Group>
      <Carousel
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
          <Carousel.Slide key={item.id} style={{ width: "100%" }}>
            <CardCarousel alt={item.title} src={item.image.url} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Group>
  );
};

export default MainCarousel;
