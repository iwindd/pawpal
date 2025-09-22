"use client";
import { Product } from "@pawpal/prisma";
import {
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import NextImage from "next/image";
import classes from "./style.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const __ = useTranslations("Home.ProductRow");
  const format = useFormatter();

  const formatPrice = (price: number) => {
    return format.number(price, {
      style: "currency",
      currency: "THB",
      currencyDisplay: "code",
    });
  };

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
          {/*     TODO: Add discount and flashsale 
          {product.discount && (
            <Badge color="red" size="sm" className={classes.discountBadge}>
              -{product.discount}%
            </Badge>
          )}
          {product.isFlashsale && (
            <Badge color="orange" size="sm" className={classes.flashsaleBadge}>
              {__("flashsale")}
            </Badge>
          )} */}
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
