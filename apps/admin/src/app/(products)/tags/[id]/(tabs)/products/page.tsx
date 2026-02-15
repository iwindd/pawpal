"use client";
import ProductInTagDatatable from "@/components/Datatables/ProductInTag";
import { useGetProductsInTagQuery } from "@/features/productApi/productTagApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminProductResponse } from "@pawpal/shared";
import { Box, Paper } from "@pawpal/ui/core";
import { useProductTag } from "../../ProductTagContext";

const ProductTagProducts = () => {
  const { productTag } = useProductTag();
  const datatable = useDatatable<AdminProductResponse>();

  const { data, isLoading } = useGetProductsInTagQuery({
    id: productTag.id,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  return (
    <Box py="md">
      <Paper p={0}>
        <ProductInTagDatatable
          records={data?.data ?? []}
          fetching={isLoading}
          totalRecords={data?.total ?? 0}
          {...datatable}
        />
      </Paper>
    </Box>
  );
};

export default ProductTagProducts;
