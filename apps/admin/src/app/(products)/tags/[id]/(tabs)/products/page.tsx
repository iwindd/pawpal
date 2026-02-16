"use client";
import ProductInTagDatatable from "@/components/Datatables/ProductInTag";
import { useGetProductsInTagQuery } from "@/features/tag/tagApi";
import useDatatable from "@/hooks/useDatatable";
import { AdminProductResponse } from "@pawpal/shared";
import { Box, Paper } from "@pawpal/ui/core";
import { useTag } from "../../TagContext";

const TagProducts = () => {
  const { tag } = useTag();
  const datatable = useDatatable<AdminProductResponse>();

  const { data, isLoading } = useGetProductsInTagQuery({
    id: tag.id,
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

export default TagProducts;
