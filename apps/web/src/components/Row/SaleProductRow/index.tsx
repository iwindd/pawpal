"use client";
import ProductCard from "@/components/Card/ProductCart";
import { useGetInfiniteSaleProductsInfiniteQuery } from "@/features/product/productApi";
import { ProductResponse } from "@pawpal/shared";
import { Carousel } from "@pawpal/ui/carousel";
import { Box, DataTableSortStatus, Group, Text } from "@pawpal/ui/core";
import { useMediaQuery } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import classes from "./style.module.css";

const SaleProductRow = () => {
  const __ = useTranslations("Home.ProductSections.SaleProductRow");

  const { data } = useGetInfiniteSaleProductsInfiniteQuery({
    limit: 12,
    sort: JSON.stringify({
      columnAccessor: "createdAt",
      direction: "desc",
    } as DataTableSortStatus<ProductResponse>),
  });

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const withControls = useMediaQuery(`(min-width: 100em)`);

  return (
    <Box>
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <Text size="xl" fw={700}>
            {__("title")}
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
        {products.map((product) => (
          <Carousel.Slide key={product.slug}>
            <ProductCard product={product} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Box>
  );
};

export default SaleProductRow;
