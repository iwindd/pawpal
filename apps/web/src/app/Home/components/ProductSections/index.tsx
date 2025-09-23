import { homeProductSections } from "@/configs/home";
import APISession from "@/libs/api/server";
import { Box, Container, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Section from "./components/section";
import classes from "./style.module.css";

const ProductSections = async () => {
  const __ = useTranslations("Home.ProductSections");
  const API = await APISession();

  return (
    <Box className={classes.container}>
      <Container size="xl" px="md">
        <Stack gap="xl">
          {homeProductSections.map(async (section) => (
            <Section
              key={section.key}
              label={section.label}
              icon={section.icon}
              products={await section.onLoad(API)}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductSections;
