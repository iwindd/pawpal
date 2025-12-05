"use client";
import ResourceImage from "@/components/ResourceImage";
import { useGetPublishedCarouselsQuery } from "@/services/carousel";
import { CarouselResponse } from "@pawpal/shared";
import { Autoplay, Carousel } from "@pawpal/ui/carousel";
import { Box, Button, Paper, Stack, Text, Title } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import classes from "./style.module.css";

interface CardProps {
  image: string;
  title: string;
  category: string;
  href?: string;
}

function Card({ image, title, category, href }: Readonly<CardProps>) {
  const onClick = () => {
    // this is for testing
    console.log("clicked");
  };

  return (
    <Paper shadow="md" p="xl" radius={0} className={classes.card}>
      <div className={classes.imageContainer}>
        <ResourceImage
          src={image}
          alt={title}
          fallbackSrc="/assets/images/fallback-carousel.jpg"
          height={530}
          width={1920}
          className={classes.image}
        />
        <div className={classes.overlay}>
          <Stack gap={0} className={classes.carouselMessage} justify="end">
            <Text className={classes.category} size="xs" m="0">
              {category}
            </Text>
            <Title order={6} className={classes.title} m="0">
              {title}
            </Title>
          </Stack>
          <Box>
            {href && (
              <Button
                variant="priamry"
                mt={"md"}
                onClick={onClick}
                className={classes.button}
                px={"xl"}
              >
                Topup
              </Button>
            )}
          </Box>
        </div>
      </div>
    </Paper>
  );
}

const data = [
  {
    image: "fallback-carousel.jpg",
    title: "Best forests to visit in North America",
    category: "nature",
    href: "/products/nature",
  },
  {
    image: "fallback-carousel.jpg",
    title: "Hawaii beaches review: better than you think",
    category: "beach",
    href: "/products/beach",
  },
  {
    image: "fallback-carousel.jpg",
    title: "Mountains at night: 12 best locations to enjoy the view",
    category: "nature",
  },
  {
    image: "fallback-carousel.jpg",
    title: "Aurora in Norway: when to visit for best experience",
    category: "nature",
  },
  {
    image: "fallback-carousel.jpg",
    title: "Best places to visit this winter",
    category: "tourism",
    href: "/products/tourism",
  },
  {
    image: "fallback-carousel.jpg",
    title: "Active volcanos reviews: travel at your own risk",
    category: "nature",
    href: "/products/nature",
  },
];

export function PreviewCarousel() {
  const autoplay = useRef(Autoplay({ delay: 7000 }));
  const __ = useTranslations("Carousel.main");
  const [slides, setSlides] = useState<CarouselResponse[]>([]);
  const { data: publishedCarousels } = useGetPublishedCarouselsQuery({});

  useEffect(() => {
    if (publishedCarousels?.data) {
      setSlides(publishedCarousels.data);
    }
  }, [publishedCarousels]);

  if (slides.length === 0)
    return (
      <Text size="xs" c="dimmed" fs="italic">
        {__("no-published-carousels")}
      </Text>
    );

  return (
    <Paper h="100%" radius={0}>
      <Carousel
        slideSize={{ base: "100%" }}
        withControls={false}
        withIndicators={true}
        emblaOptions={{
          loop: true,
        }}
        plugins={[autoplay.current]}
      >
        {slides.map((carousel: CarouselResponse) => (
          <Carousel.Slide key={carousel.id}>
            <Card
              image={carousel.image.url}
              title={carousel.title}
              category={carousel.product?.name || "No Product"}
              href={
                carousel.product
                  ? `/products/${carousel.product.id}`
                  : undefined
              }
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Paper>
  );
}
