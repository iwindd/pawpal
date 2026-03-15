"use client";

import { useAppSelector } from "@/hooks";
import { IconFilters } from "@pawpal/icons";
import { ProductFiltersResponse } from "@pawpal/shared";
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
import { ReactNode } from "react";
import SearchBar from "../../../(all)/products/components/SearchBar";
import TypeAdvancedFilters from "./advanced-filters";
import { TypeProductProvider, useProductContext } from "./product-context";

interface VisibleFilterSections {
  categories?: boolean;
  platforms?: boolean;
  tags?: boolean;
}

interface TypeProductsLayoutProps {
  basePath: string;
  children: ReactNode;
  filtersDataOverride?: ProductFiltersResponse;
  productType: string;
  visibleFilterSections?: VisibleFilterSections;
}

interface TypeProductsLayoutContentProps {
  children: ReactNode;
  filtersDataOverride?: ProductFiltersResponse;
  visibleFilterSections?: VisibleFilterSections;
}

const TypeProductsLayoutContent = ({
  children,
  filtersDataOverride,
  visibleFilterSections,
}: TypeProductsLayoutContentProps) => {
  const { state, handlers, productsQuery } = useProductContext();
  const globalFiltersData = useAppSelector((state) => state.product.filters);
  const filtersData = filtersDataOverride ?? globalFiltersData;
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
              <TypeAdvancedFilters
                filtersData={filtersData || undefined}
                platforms={state.platforms}
                tags={state.tags}
                categories={state.categories}
                onPlatformsChange={handlers.handlePlatforms}
                onTagsChange={handlers.handleTags}
                onCategoriesChange={handlers.handleCategories}
                visibleSections={visibleFilterSections}
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
            <TypeAdvancedFilters
              filtersData={filtersData || undefined}
              platforms={state.platforms}
              tags={state.tags}
              categories={state.categories}
              onPlatformsChange={handlers.handlePlatforms}
              onTagsChange={handlers.handleTags}
              onCategoriesChange={handlers.handleCategories}
              visibleSections={visibleFilterSections}
            />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Container>
  );
};

export default function TypeProductsLayout({
  basePath,
  children,
  filtersDataOverride,
  productType,
  visibleFilterSections,
}: TypeProductsLayoutProps) {
  return (
    <TypeProductProvider basePath={basePath} productType={productType}>
      <TypeProductsLayoutContent
        filtersDataOverride={filtersDataOverride}
        visibleFilterSections={visibleFilterSections}
      >
        {children}
      </TypeProductsLayoutContent>
    </TypeProductProvider>
  );
}
