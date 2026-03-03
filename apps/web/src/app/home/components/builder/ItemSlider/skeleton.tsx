"use client";
import ProductCardSkeleton from "@/components/Card/ProductCart/skeleton";
import { Carousel } from "@pawpal/ui/carousel";
import { Box, Group, Skeleton } from "@pawpal/ui/core";
import { useMediaQuery } from "@pawpal/ui/hooks";
import classes from "./style.module.css";

const ItemSliderSkeleton = () => {
  const withControls = useMediaQuery(`(min-width: 100em)`);

  return (
    <Box>
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Skeleton h={30} w={250} mb={"md"} />
        </Group>
      </Group>
      <Carousel
        height={"auto"}
        classNames={classes}
        slideSize={{
          base: "50%",
          sm: "33.3333%",
          md: "20%",
          lg: "16.6666%",
        }}
        slideGap={{ base: "xs" }}
        withIndicators={false}
        withControls={withControls}
        emblaOptions={{ align: "start", dragThreshold: 0 }}
      >
        {[1, 2, 3, 4, 5, 6].map((product) => (
          <Carousel.Slide key={product}>
            <ProductCardSkeleton />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
};

export default ItemSliderSkeleton;
