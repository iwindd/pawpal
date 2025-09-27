"use client";
import { getSectionIcon, isFlashsale } from "@/utils/productUtils";
import { ProductListItem } from "@pawpal/shared";
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
import Link from "next/link";
import classes from "./style.module.css";

interface ProductCardProps {
  product: ProductListItem;
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
                -{product.sales.percent}%
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
                {/* Price will be displayed when package data is available */}
              </Text>
            </Group>
          </Stack>
        </Group>

        <Button
          component={Link}
          href={`/products/${product.slug}`}
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
