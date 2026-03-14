"use client";

import { useAppSelector } from "@/hooks";
import { Card, Container, Grid } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import AdvancedFilters from "./components/AdvancedFilters";
import SearchBar from "./components/SearchBar";
import { ProductProvider, useProductContext } from "./context/ProductContext";

const ProductsLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { state, handlers, productsQuery } = useProductContext();
  const filtersData = useAppSelector((state) => state.product.filters);
  const __ = useTranslations("Products");

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
                <SearchBar
                  search={state.search}
                  onSearchChange={handlers.handleSearch}
                />
              }
            ></Card.Header>
          </Card>
        </Grid.Col>
        <Grid.Col span={3}>
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
        </Grid.Col>
        <Grid.Col span={9}>{children}</Grid.Col>
      </Grid>
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
