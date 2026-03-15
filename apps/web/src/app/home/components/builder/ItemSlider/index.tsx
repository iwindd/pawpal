"use client";
import ProductCard from "@/components/Card/ProductCart";
import { ProductResponse } from "@pawpal/shared";
import { Carousel } from "@pawpal/ui/carousel";
import { Box, Group, Text } from "@pawpal/ui/core";
import { useMediaQuery } from "@pawpal/ui/hooks";
import classes from "./style.module.css";

interface ItemSliderProps {
  title: string;
  items: ProductResponse[];
}

const ItemSlider = ({ title, items }: ItemSliderProps) => {
  const withControls = useMediaQuery(`(min-width: 100em)`);

  return (
    <Box>
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Text size="xl" fw={700}>
            {title}
          </Text>
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
        {items.map((product) => (
          <Carousel.Slide key={product.slug}>
            <ProductCard product={product} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
};

export default ItemSlider;
