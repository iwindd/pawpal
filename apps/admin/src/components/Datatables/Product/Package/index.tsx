"use client";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { AdminProductPackageResponse } from "@pawpal/shared";
import { DataTable, DataTableProps, Text } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";

interface ProductPackageDatatableProps {
  productId: string;
}

const ProductPackageDatatable = ({
  productId,
}: ProductPackageDatatableProps) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.productPackage");
  const { above, ...datatable } = useDatatable<AdminProductPackageResponse>({
    sortStatus: {
      columnAccessor: "price",
      direction: "desc",
    },
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "packages",
      productId,
      datatable.page,
      datatable.sortStatus.columnAccessor,
      datatable.sortStatus.direction,
    ],
    queryFn: () =>
      API.package.getProductPackages(productId, {
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  const columns: DataTableProps<AdminProductPackageResponse>["columns"] = [
    {
      accessor: "name",
      title: __("name"),
      sortable: true,
    },
    {
      accessor: "description",
      title: __("description"),
      sortable: true,
      render: (record) => <Text truncate>{record.description || "-"}</Text>,
    },
    {
      accessor: "price",
      title: __("price"),
      sortable: true,
      render: (record) => format.number(+record.price, "currency"),
    },
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: __("createdAt"),
      render: (record) =>
        format.dateTime(new Date(record.createdAt), "dateTime"),
    },
  ];

  return (
    <DataTable
      highlightOnHover
      height="65.4dvh"
      minHeight={400}
      maxHeight={1000}
      idAccessor="id"
      columns={columns}
      records={data?.data.data ?? []}
      totalRecords={data?.data.total ?? 0}
      recordsPerPage={datatable.limit}
      page={datatable.page}
      onPageChange={datatable.setPage}
      fetching={isFetching}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default ProductPackageDatatable;
