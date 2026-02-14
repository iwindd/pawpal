"use client";
import ProductInCategoryDatatable from "@/components/Datatables/ProductInCategory";
import { useGetProductsInCategoryQuery } from "@/features/category/categoryApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminProductResponse } from "@pawpal/shared";
import { Box, Paper } from "@pawpal/ui/core";
import { useCategory } from "../../CategoryContext";

const CategoryProducts = () => {
  const { category } = useCategory();
  const datatable = useDatatable<AdminProductResponse>();

  const { data, isLoading } = useGetProductsInCategoryQuery({
    id: category.id,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  return (
    <Box py="md">
      <Paper p={0}>
        <ProductInCategoryDatatable
          records={data?.data ?? []}
          fetching={isLoading}
          totalRecords={data?.total ?? 0}
          {...datatable}
        />
      </Paper>
    </Box>
  );
};

export default CategoryProducts;
