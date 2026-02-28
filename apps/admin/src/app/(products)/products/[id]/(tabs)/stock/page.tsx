"use client";
import { useGetProductStockQuery } from "@/features/productApi/productApi";
import { Box, Card, Skeleton } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";
import ProductStockForm from "./ProductStockForm";

const StockPage = () => {
  const { product } = useProduct();
  const __ = useTranslations("Product.stock");

  const { data: stockData, isLoading: isFetching } = useGetProductStockQuery(
    product.id,
  );

  if (isFetching || !stockData) {
    return (
      <Card withBorder shadow="sm" radius="md" p="md">
        <Card.Header title={__("title")} />
        <Card.Content>
          <Box pt="md">
            <Skeleton height={20} width="40%" mb="sm" />
            <Skeleton height={14} width="60%" mb="xl" />
            <Skeleton height={36} maw={500} mb="xl" />
            <Skeleton height={36} width={100} />
          </Box>
        </Card.Content>
      </Card>
    );
  }

  return <ProductStockForm data={stockData} />;
};

export default StockPage;
