"use client";
import { Autoplay, Carousel } from "@pawpal/ui/carousel";
import { Box, Button, Flex, Group, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef, useState } from "react";
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
  const [items] = useState(CAROUSEL_MOCKUP);
  const [activeIndex, setActiveIndex] = useState(0);
  const __ = useTranslations("Home.CardCarousel");

  const currentItem = items[activeIndex];

  return (
    <Group className={classes.wrapper}>
      <Group className={`${classes.overlay} ${classes.fader}`}>
        <Box className={classes.content}>
          <Flex className={classes.flex}>
            <Stack gap={0} className={classes.carouselMessage} justify="end">
              <Text className={classes.category} size="xs" m="0">
                {currentItem?.category}
              </Text>
              <Title order={3} className={classes.title} m="0">
                {currentItem?.title}
              </Title>
            </Stack>
            <Box>
              {currentItem?.href && (
                <Button
                  component={Link}
                  variant="priamry"
                  mt={"md"}
                  className={classes.button}
                  href={currentItem.href}
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
            <CardCarousel {...item} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Group>
  );
};

export default MainCarousel;
