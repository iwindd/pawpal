"use client";
import { useGetProductPackagesQuery } from "@/features/package/packageApi";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit } from "@pawpal/icons";
import { AdminProductPackageResponse } from "@pawpal/shared";
import { DataTable, Text } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../../action";
import useEditPackageModal from "./edit";

interface ProductPackageDatatableProps {
  productId: string;
}

const ProductPackageDatatable = ({
  productId,
}: ProductPackageDatatableProps) => {
  const format = useFormatter();
  const editPackage = useEditPackageModal();
  const __ = useTranslations("Datatable.productPackage");
  const datatable = useDatatable<AdminProductPackageResponse>({
    sortStatus: {
      columnAccessor: "price",
      direction: "desc",
    },
    columns: ({ above }) => [
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
      {
        accessor: "actions",
        title: __("actions"),
        render: (record) => (
          <TableAction
            displayType="icon"
            actions={[
              {
                translate: "edit",
                icon: IconEdit,
                color: "blue",
                action: () => editPackage.open(record),
              },
            ]}
          />
        ),
      },
    ],
  });

  const { data, isFetching } = useGetProductPackagesQuery({
    productId,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  return (
    <>
      <DataTable
        idAccessor="id"
        records={data?.data ?? []}
        totalRecords={data?.total ?? 0}
        fetching={isFetching}
        {...datatable.props}
      />

      {editPackage.modal}
    </>
  );
};

export default ProductPackageDatatable;
