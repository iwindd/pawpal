"use client";
import ResourceImage from "@/components/ResourceImage";
import { useLazySearchProductsQuery } from "@/features/product/productApi";
import { IconSearch } from "@pawpal/icons";
import { Badge, Box, Group, Loader, Text } from "@pawpal/ui/core";
import { useDebouncedValue } from "@pawpal/ui/hooks";
import { Spotlight, spotlight } from "@pawpal/ui/spotlight";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./style.module.css";

const ProductSpotlight = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const [searchProducts, { data, isFetching, isError }] =
    useLazySearchProductsQuery();

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      searchProducts({ search: debouncedQuery, limit: 10 });
    }
  }, [debouncedQuery, searchProducts]);

  const products = data?.data || [];
  const showLoading = isFetching;
  const showEmpty =
    !isFetching &&
    !isError &&
    debouncedQuery.trim() !== "" &&
    products.length === 0;

  const handleActionContextClick = (slug: string) => {
    spotlight.close();
    router.push(`/products/${slug}`);
  };

  const productActions = products.map((product) => (
    <Spotlight.Action
      key={product.id}
      onClick={() => handleActionContextClick(product.slug)}
      className={classes.action}
      p="sm"
    >
      <Group wrap="nowrap" w="100%">
        {product.name && (
          <Box w={40} h={40} pos="relative" style={{ flexShrink: 0 }}>
            <ResourceImage
              src={product.name}
              alt={product.name || "Product image"}
              fill
              fit="contain"
              fallbackSrc="/assets/images/fallback-product.png"
            />
          </Box>
        )}
        <Box style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {product.name}
          </Text>
          <Group gap="xs" mt={2}>
            {product.category && (
              <Badge size="sm" variant="light" color="blue">
                {product.category.name}
              </Badge>
            )}
            {product.MOST_SALE && (
              <Badge size="sm" variant="filled" color="red">
                Sale
              </Badge>
            )}
          </Group>
        </Box>
      </Group>
    </Spotlight.Action>
  ));

  return (
    <Spotlight.Root query={query} onQueryChange={setQuery}>
      <Spotlight.Search
        placeholder="ค้นหาสินค้า..."
        leftSection={<IconSearch stroke={1.5} />}
        rightSection={showLoading ? <Loader size="xs" /> : null}
      />
      <Spotlight.ActionsList>
        {debouncedQuery.trim() === "" ? (
          <Spotlight.Empty>พิมพ์ชื่อสินค้าเพื่อค้นหา</Spotlight.Empty>
        ) : showEmpty ? (
          <Spotlight.Empty>ไม่พบสินค้า</Spotlight.Empty>
        ) : (
          productActions
        )}
      </Spotlight.ActionsList>
    </Spotlight.Root>
  );
};

export default ProductSpotlight;
