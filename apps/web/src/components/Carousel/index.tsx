"use client";
import { CarouselResponse } from "@pawpal/shared";
import { Autoplay, Carousel as CarouselUI } from "@pawpal/ui/carousel";
import { Box, Button, Flex, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
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

  const currentItem = items[activeIndex];

  if (items.length === 0) {
    return null;
  }

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
