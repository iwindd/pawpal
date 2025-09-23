import APISession from "@/libs/api/server";
import { ProductTagResponse } from "@pawpal/shared";
import { Box, Container, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Section from "./components/section";
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
          {productTags.map((tag: ProductTagResponse) => (
            <Section key={tag.slug} tag={tag} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductSections;
