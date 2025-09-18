"use client";
import { Box } from "@pawpal/ui/core";
import { Product, ProductType } from "../../types";
import ProductGrid from "../ProductGrid";
import SectionHeader from "../SectionHeader";
import classes from "./style.module.css";

interface ProductRowProps {
  title: string;
  type: ProductType;
  products: Product[];
  showMore?: boolean;
  onShowMore?: () => void;
}

const ProductRow = ({
  title,
  type,
  products,
  showMore = false,
  onShowMore,
}: ProductRowProps) => {
  const flashsaleEndTime =
    type === "flashsale" && products.length > 0
      ? products[0]?.flashsaleEndTime
      : undefined;

  return (
    <Box className={classes.container}>
      <SectionHeader
        title={title}
        type={type}
        showMore={showMore}
        onShowMore={onShowMore}
        flashsaleEndTime={flashsaleEndTime}
      />
      <ProductGrid products={products} maxItems={4} />
    </Box>
  );
};

export default ProductRow;
