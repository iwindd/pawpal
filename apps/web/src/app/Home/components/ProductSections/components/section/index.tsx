"use client";
import { isFlashsale } from "@/utils/productUtils";
import { ProductResponse } from "@pawpal/shared";
import { Box, Grid, Group, Text } from "@pawpal/ui/core";
import dayjs from "dayjs";
import Countdown from "../../../Countdown";
import ProductCard from "../card";
import classes from "./style.module.css";

interface SectionProps {
  label: string;
  icon?: React.ReactNode;
  products: ProductResponse[];
}

const Section = ({ label, icon, products }: SectionProps) => {
  const closestToEndingFlashsale = [...products]
    .filter((product) => isFlashsale(product.sales))
    .sort((a, b) => {
      const endAtA = dayjs(a.sales?.endAt);
      const endAtB = dayjs(b.sales?.endAt);
      return endAtA.diff(endAtB, "hour");
    })[0];

  return (
    <Box className={classes.container}>
      <Group justify="space-between" align="center" mb="md">
        <Group gap="sm">
          <Text size="xl" fw={700}>
            {icon} {label}
          </Text>
          {closestToEndingFlashsale?.sales?.endAt && (
            <Countdown
              endTime={
                closestToEndingFlashsale.sales.endAt as unknown as string
              }
            />
          )}
        </Group>
      </Group>
      <Grid>
        {products.map((product: ProductResponse) => (
          <Grid.Col
            span={{
              xs: 12,
              md: 3,
              lg: 3,
            }}
            key={product.slug}
          >
            <ProductCard key={product.slug} product={product} />
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
};

export default Section;
