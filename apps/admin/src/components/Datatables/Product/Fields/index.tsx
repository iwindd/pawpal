"use client";
import FieldOptionalBadge from "@/components/Badges/FieldOptional";
import FieldTypeBadge from "@/components/Badges/FieldType";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { IconEdit } from "@pawpal/icons";
import { AdminFieldResponse } from "@pawpal/shared";
import { DataTable, DataTableProps, Text, Title } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../../action";

interface ProductFieldDatatable {
  productId: string;
}

const ProductFieldDatatable = ({ productId }: ProductFieldDatatable) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.field");
  const { above, ...datatable } = useDatatable<AdminFieldResponse>({
    sortStatus: {
      columnAccessor: "createdAt",
      direction: "desc",
    },
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "fields",
      productId,
      datatable.page,
      datatable.sortStatus.columnAccessor,
      datatable.sortStatus.direction,
    ],
    queryFn: () =>
      API.field.getProductFields(productId, {
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  const columns: DataTableProps<AdminFieldResponse>["columns"] = [
    {
      accessor: "label",
      title: __("label"),
      render: (record) => (
        <div>
          <Title order={6}>{record.label}</Title>
          <Text size="xs" c="dimmed">
            {record.placeholder}
          </Text>
        </div>
      ),
    },
    {
      accessor: "type",
      title: __("type"),
      render: (record) => <FieldTypeBadge type={record.type} />,
    },
    {
      accessor: "optional",
      title: __("optional"),
      render: (record) => <FieldOptionalBadge optional={record.optional} />,
    },
    {
      accessor: "creator.displayName",
      title: __("creator"),
    },
    {
      accessor: "createdAt",
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
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      highlightOnHover
      height="65.4dvh"
      minHeight={400}
      maxHeight={1000}
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

export default ProductFieldDatatable;
