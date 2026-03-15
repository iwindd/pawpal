"use client";
import ResourceImage from "@/components/ResourceImage";
import { getPercentDiscount } from "@/utils/pricing";
import { isFlashsale } from "@/utils/productUtils";
import { ProductResponse } from "@pawpal/shared";
import {
  Badge,
  Box,
  Card,
  Center,
  Group,
  Skeleton,
  Text,
} from "@pawpal/ui/core";
import Link from "next/link";
import { useState } from "react";
import classes from "./style.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      key={product.slug}
      shadow="sm"
      component={Link}
      href={`/products/${product.slug}`}
      w={"100%"}
      className={classes.card}
      padding={0}
      radius={0}
      withBorder={false}
      p={"xs"}
    >
      <Card.Section
        style={{
          aspectRatio: "500 / 550",
          position: "relative",
        }}
      >
        {!imageLoaded && <Skeleton pos="absolute" w="100%" h="100%" />}
        <Box w="100%" h="100%" pos="absolute">
          <ResourceImage
            src={product.name}
            alt={product.name}
            fill
            fit="contain"
            loading="eager"
            style={{
              filter: imageLoaded ? "blur(0px)" : "blur(4px)",
              transition: "filter 0.25s ease-in-out",
            }}
            fallbackSrc="/assets/images/fallback-product.png"
            onLoad={() => setImageLoaded(true)}
          />
        </Box>
        {product.MOST_SALE && (
          <Group pos="absolute" bottom={0} left={0} w="100%" mb={"xs"} px="xs">
            <Badge
              color={isFlashsale(product.MOST_SALE) ? "red" : "orange"}
              size="md"
              className={classes.discountBadge}
              pl={(isFlashsale(product.MOST_SALE) && 4) || "sm"}
            >
              -
              {getPercentDiscount(
                product.MOST_SALE.discountType,
                product.MOST_SALE.discount,
                (product.MOST_SALE?.price && Number(product.MOST_SALE.price)) ||
                  0,
              )}
              %
            </Badge>
          </Group>
        )}
      </Card.Section>

      <Center>
        <Text size="sm" c="dimmed">
          {product.name}
        </Text>
      </Center>
    </Card>
  );
};

export default ProductCard;
