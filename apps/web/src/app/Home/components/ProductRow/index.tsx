"use client";
import { Product } from "@pawpal/prisma";
import { Box } from "@pawpal/ui/core";
import ProductGrid from "../ProductGrid";
import SectionHeader from "../SectionHeader";
import classes from "./style.module.css";

interface ProductRowProps {
  title: string;
  slug: string;
  products: Product[];
}

const ProductRow = ({ title, slug, products }: ProductRowProps) => {
  // TODO: Add flashsaleEndTime
  const flashsaleEndTime = "";

  return (
    <Box className={classes.container}>
      <SectionHeader
        title={title}
        slug={slug}
        flashsaleEndTime={flashsaleEndTime}
      />
      <ProductGrid products={products} />
    </Box>
  );
};

export default ProductRow;
