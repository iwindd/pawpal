"use client";
import { Box, Container, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PRODUCT_SECTIONS, ProductSection } from "../../../../data/products";
import ProductRow from "../ProductRow";
import classes from "./style.module.css";

const ProductSections = () => {
  const __ = useTranslations("Home.ProductSections");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const handleShowMore = (sectionType: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionType)) {
        newSet.delete(sectionType);
      } else {
        newSet.add(sectionType);
      }
      return newSet;
    });
  };

  const getProductsForSection = (section: ProductSection) => {
    const isExpanded = expandedSections.has(section.type);
    return isExpanded ? section.products : section.products.slice(0, 4);
  };

  return (
    <Box className={classes.container}>
      <Container size="xl" px="md">
        <Stack gap="xl">
          {PRODUCT_SECTIONS.map((section) => (
            <ProductRow
              key={section.type}
              title={section.title}
              type={section.type}
              products={getProductsForSection(section)}
              showMore={section.showMore}
              onShowMore={() => handleShowMore(section.type)}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductSections;
