"use client";
import FieldOptionalBadge from "@/components/Badges/FieldOptional";
import FieldTypeBadge from "@/components/Badges/FieldType";
import {
  useGetProductFieldsQuery,
  useReorderProductFieldMutation,
} from "@/features/field/fieldApi";
import useDatatable from "@/hooks/useDatatable";
import { IconEdit } from "@pawpal/icons";
import { AdminFieldResponse } from "@pawpal/shared";
import { DataTable, Text, Title } from "@pawpal/ui/core";
import { DragDropContext, DropResult } from "@pawpal/ui/draggable";
import { notify } from "@pawpal/ui/notifications";
import { useFormatter, useTranslations } from "next-intl";
import { DragRowFactory, DragTableWrapper } from "../..";
import TableAction from "../../action";
import useEditFieldModal from "./hooks/edit";

interface ProductFieldDatatable {
  productId: string;
}

const ProductFieldDatatable = ({ productId }: ProductFieldDatatable) => {
  const format = useFormatter();
  const __ = useTranslations("Datatable.field");
  const datatable = useDatatable<AdminFieldResponse>({
    sortStatus: {
      columnAccessor: "order",
      direction: "asc",
    },
    columns: ({ above }) => [
      {
        accessor: "dragHandle",
        title: "",
        hiddenContent: true,
        width: 60,
      },
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
                action: fieldUpdater.open.bind(null, record),
              },
            ]}
          />
        ),
      },
    ],
  });

  const { data, isLoading } = useGetProductFieldsQuery({
    productId: productId,
    params: {
      page: datatable.page,
      limit: datatable.limit,
      sort: datatable.sort,
    },
  });

  const [reorderProductFieldMutation, { isLoading: isReordering }] =
    useReorderProductFieldMutation();

  const fieldUpdater = useEditFieldModal();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const fieldId = data?.data[sourceIndex]?.id;

    if (sourceIndex === destinationIndex) return;
    if (isReordering) return;
    if (!fieldId) return;

    const response = await reorderProductFieldMutation({
      productId,
      payload: {
        fromIndex: sourceIndex,
        toIndex: destinationIndex,
        field_id: fieldId,
      },
    });

    if (!response.error) {
      notify.show({
        message: __("notify.ordered.message"),
        color: "green",
      });
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <DataTable
          records={data?.data ?? []}
          totalRecords={data?.total ?? 0}
          fetching={isLoading || isReordering}
          {...datatable.props}
          rowFactory={DragRowFactory}
          tableWrapper={DragTableWrapper}
          styles={{ table: { tableLayout: "fixed" } }}
        />
      </DragDropContext>
      {fieldUpdater.modal}
    </>
  );
};

export default ProductFieldDatatable;
