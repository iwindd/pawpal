import APISession from "@/libs/api/server";
import { Box, Container, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import ProductRow from "../ProductRow";
import classes from "./style.module.css";

const DEFAULT_PRODUCT_TAG_SECTIONS = ["latest"];

const ProductSections = async () => {
  const __ = useTranslations("Home.ProductSections");

  const API = await APISession();
  const { success, data: productTags } = await API.productTag.getProductByTags(
    DEFAULT_PRODUCT_TAG_SECTIONS
  );

  if (!success) return null;

  return (
    <Box className={classes.container}>
      <Container size="xl" px="md">
        <Stack gap="xl">
          {productTags.map((tag) => (
            <ProductRow
              key={tag.slug}
              title={tag.name}
              slug={tag.slug}
              products={tag.products}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductSections;
