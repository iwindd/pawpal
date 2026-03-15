"use client";

import { useAppSelector } from "@/hooks";
import { IconFilters } from "@pawpal/icons";
import {
  ActionIcon,
  Card,
  Container,
  Drawer,
  Grid,
  Group,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import AdvancedFilters from "./components/AdvancedFilters";
import SearchBar from "./components/SearchBar";
import { ProductProvider, useProductContext } from "./context/ProductContext";

const ProductsLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { state, handlers, productsQuery } = useProductContext();
  const filtersData = useAppSelector((state) => state.product.filters);
  const __ = useTranslations("Products");
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Container size={"xl"} mih={"100vh"}>
      <Grid mt={"md"}>
        <Grid.Col span={12}>
          <Card>
            <Card.Header
              title={__("title")}
              subtitle={
                productsQuery.isLoading
                  ? __("loading")
                  : __("count", { count: productsQuery.totalCount })
              }
              action={
                <Group gap="sm" wrap="nowrap">
                  <ActionIcon
                    variant="subtle"
                    size={"lg"}
                    onClick={toggleDrawer}
                    hiddenFrom="md"
                  >
                    <IconFilters
                      style={{ width: "70%", height: "70%" }}
                      stroke={1.5}
                    />
                  </ActionIcon>

                  <SearchBar
                    search={state.search}
                    onSearchChange={handlers.handleSearch}
                  />
                </Group>
              }
            ></Card.Header>
          </Card>
        </Grid.Col>
        <Grid.Col
          visibleFrom="md"
          span={{
            sm: 0,
            md: 4,
            lg: 3,
          }}
        >
          <Card>
            <Card.Header title={__("advancedFilters")} />
            <Card.Content>
              <AdvancedFilters
                filtersData={filtersData || undefined}
                productType={state.productType}
                platforms={state.platforms}
                tags={state.tags}
                categories={state.categories}
                onProductTypeChange={handlers.handleProductType}
                onPlatformsChange={handlers.handlePlatforms}
                onTagsChange={handlers.handleTags}
                onCategoriesChange={handlers.handleCategories}
              />
            </Card.Content>
          </Card>
        </Grid.Col>
        <Grid.Col
          span={{
            sm: 12,
            md: 8,
            lg: 9,
          }}
        >
          {children}
        </Grid.Col>
      </Grid>

      <Drawer.Root
        opened={drawerOpened}
        onClose={closeDrawer}
        hiddenFrom="md"
        position="left"
        padding="md"
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{__("advancedFilters")}</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <AdvancedFilters
              filtersData={filtersData || undefined}
              productType={state.productType}
              platforms={state.platforms}
              tags={state.tags}
              categories={state.categories}
              onProductTypeChange={handlers.handleProductType}
              onPlatformsChange={handlers.handlePlatforms}
              onTagsChange={handlers.handleTags}
              onCategoriesChange={handlers.handleCategories}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Container>
  );
};

const ProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProductProvider>
      <ProductsLayoutContent>{children}</ProductsLayoutContent>
    </ProductProvider>
  );
};

export default ProductsLayout;
