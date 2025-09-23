import { homeProductSections } from "@/configs/home";
import APISession from "@/libs/api/server";
import { Box, Container, Stack } from "@pawpal/ui/core";
import Section from "./components/section";
import classes from "./style.module.css";

const ProductSections = async (): Promise<React.JSX.Element> => {
  const API = await APISession();

  // Load all sections data in parallel
  const sectionsData = await Promise.all(
    homeProductSections.map(async (section) => ({
      key: section.key,
      label: section.label,
      icon: section.icon,
      products: await section.onLoad(API),
    }))
  );

  return (
    <Box className={classes.container}>
      <Container size="xl" px="md">
        <Stack gap="xl">
          {sectionsData.map((section) => (
            <Section
              key={section.key}
              label={section.label}
              icon={section.icon}
              products={section.products}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default ProductSections;
