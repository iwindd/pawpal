"use client";
import { useAppRouter } from "@/hooks/useAppRouter";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit } from "@pawpal/icons";
import { AdminProductResponse } from "@pawpal/shared";
import { DataTable } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<AdminProductResponse> {}

const ProductDatatable = ({
  records,
  totalRecords,
  limit,
  page,
  setPage,
  fetching,
  sortStatus,
  setSortStatus,
  above,
}: Props) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.product");
  const appRouter = useAppRouter();
  const datatable = useDatatable<AdminProductResponse>({
    columns: [
      {
        accessor: "name",
        noWrap: true,
        sortable: true,
        title: __("name"),
      },
      {
        accessor: "category.name",
        noWrap: true,
        sortable: true,
        title: __("category"),
        visibleMediaQuery: above.xs,
      },
      {
        accessor: "productTags._count",
        noWrap: true,
        sortable: true,
        render: (value) => "-", // TODO:: Show product tags
        title: __("productTags"),
        visibleMediaQuery: above.md,
      },
      {
        accessor: "packages._count",
        noWrap: true,
        sortable: true,
        title: __("packages"),
        render: (value) =>
          __("packageFormat", {
            count: format.number(value.packageCount, "count"),
          }),
      },
      {
        accessor: "createdAt",
        noWrap: true,
        sortable: true,
        title: __("createdAt"),
        render: (value) => format.dateTime(new Date(value.createdAt), "date"),
        visibleMediaQuery: above.md,
      },
      {
        accessor: "actions",
        title: "",
        textAlign: "center",
        render: (record) => (
          <TableAction
            displayType="icon"
            actions={[
              {
                color: "secondary",
                icon: IconEdit,
                action: appRouter.path("products.product", {
                  id: record.id,
                }),
              },
            ]}
          />
        ),
      },
    ],
  });

  return (
    <DataTable
      idAccessor="slug"
      records={records}
      totalRecords={totalRecords}
      fetching={fetching}
      {...datatable.props}
    />
  );
};

export default ProductDatatable;
