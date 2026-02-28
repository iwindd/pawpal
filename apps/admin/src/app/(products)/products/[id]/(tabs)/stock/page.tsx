"use client";
import StockMovementDatatable from "@/components/Datatables/Product/Stock/StockMovementDatatable";
import { useGetProductStockQuery } from "@/features/productApi/productApi";
import { Box, Card, Skeleton, Stack } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";
import ProductStockForm from "./ProductStockForm";

const StockPage = () => {
  const { product } = useProduct();
  const __ = useTranslations("Product.stock");

  const { data: stockData, isLoading: isFetching } = useGetProductStockQuery(
    product.id,
  );

  const isLoading = isFetching || !stockData;

  return (
    <Stack>
      {isLoading ? (
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
      ) : (
        <ProductStockForm data={stockData} />
      )}

      <StockMovementDatatable productId={product.id} />
    </Stack>
  );
};

export default StockPage;
