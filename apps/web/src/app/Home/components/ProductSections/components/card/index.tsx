"use client";
import { getSectionIcon, isFlashsale } from "@/utils/productUtils";
import { ProductTagResponse } from "@pawpal/shared";
import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import classes from "./style.module.css";

interface ProductCardProps {
  product: ProductTagResponse["products"][number];
}

const ProductCard = ({ product }: ProductCardProps) => {
  const __ = useTranslations("Home.ProductRow");

  return (
    <Card
      key={product.slug}
      shadow="sm"
      padding="lg"
      radius="md"
      className={classes.productCard}
    >
      <Card.Section>
        <div className={classes.imageContainer}>
          <Image
            component={NextImage}
            src={`/assets/images/products/${product.slug}`}
            alt={product.name}
            height={200}
            width={200}
            fit="cover"
            loading="lazy"
            fallbackSrc="/assets/images/fallback-product.jpg"
          />
          {product.sales?.percent && (
            <Group>
              <Badge
                color={isFlashsale(product.sales) ? "red" : "orange"}
                size="md"
                className={classes.discountBadge}
                pl={(isFlashsale(product.sales) && 4) || "sm"}
                leftSection={
                  isFlashsale(product.sales) && getSectionIcon("flashsale")
                }
              >
                -{product.sales.percent as number}%
              </Badge>
            </Group>
          )}
        </div>
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Title order={4} lineClamp={2} className={classes.productTitle}>
          {product.name}
        </Title>

        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Group gap="xs" align="baseline">
              <Text size="lg" fw={700} c="blue">
                {/* TODO: Add price (range) */}
              </Text>
            </Group>
          </Stack>
        </Group>

        <Button
          fullWidth
          variant="filled"
          size="sm"
          mt="sm"
          className={classes.buyButton}
        >
          {__("buyNow")}
        </Button>
      </Stack>
    </Card>
  );
};

export default ProductCard;
