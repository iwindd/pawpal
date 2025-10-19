import API from "@/libs/api/client";
import { IconEdit } from "@pawpal/icons";
import { CarouselReorderInput, CarouselResponse } from "@pawpal/shared";
import { DataTable, DataTableProps, Stack, Text, Title } from "@pawpal/ui/core";
import { DragDropContext, DropResult } from "@pawpal/ui/draggable";
import { Notifications } from "@pawpal/ui/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DragRowFactory, DragTableWrapper } from "..";
import TableAction from "../action";
import ColumnImage from "./components/ColumnImage";

const PublishDatatable = () => {
  const [records, setRecords] = useState<CarouselResponse[]>([]);
  const __ = useTranslations("Carousel");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["carousels", "published"],
    queryFn: () => API.carousel.getPublished(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CarouselReorderInput) =>
      await API.carousel.reorder(data),
    onSuccess: () => {
      refetch();
      Notifications.show({
        title: __("reorder.success.title"),
        message: __("reorder.success.message"),
        color: "green",
      });
    },
    onError: () => {
      Notifications.show({
        title: __("reorder.error.title"),
        message: __("reorder.error.message"),
        color: "red",
      });
    },
  });

  const columns: DataTableProps<CarouselResponse>["columns"] = [
    {
      accessor: "order",
      noWrap: true,
      sortable: true,
      textAlign: "center",
      hiddenContent: true,
      title: "#",
      width: "50px",
    },
    {
      accessor: "image.url",
      noWrap: true,
      sortable: false,
      title: "image",
      render: (value) => (
        <ColumnImage image={value.image.url} title={value.title} />
      ),
      width: 100,
    },
    {
      accessor: "title",
      noWrap: true,
      sortable: false,
      textAlign: "left",
      title: "title",
      render: (value) => {
        return (
          <Stack gap={0} justify="center">
            <Title order={5}>{value.title}</Title>
            <Text size="xs" c="dimmed">
              {value.product?.name}
            </Text>
          </Stack>
        );
      },
    },
    {
      accessor: "actions",
      title: "actions",
      textAlign: "right",
      render: (carousel) => (
        <TableAction
          displayType="icon"
          align="end"
          actions={[
            {
              translate: "edit",
              action: `/website/carousel/${carousel.id}`,
              icon: IconEdit,
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    if (data?.data.data) {
      setRecords(data.data.data);
    }
  }, [data]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const carouselId = records[sourceIndex]?.id;

    if (sourceIndex === destinationIndex) return;
    if (isPending) return;
    if (!carouselId) return;

    mutate({
      carousel_id: carouselId,
      fromIndex: sourceIndex,
      toIndex: destinationIndex,
    });
  };

  if (isFetching && !data) return null;
  if (!data || data.data.data.length === 0) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <DataTable
        striped
        highlightOnHover
        maxHeight={530}
        columns={columns}
        fetching={isFetching || isPending}
        records={[...records].sort((a, b) => a.order - b.order)}
        tableWrapper={DragTableWrapper}
        styles={{
          table: {
            tableLayout: "fixed",
          },
          header: {
            visibility: "collapse",
          },
        }}
        scrollAreaProps={{ type: "never" }}
        rowFactory={DragRowFactory}
      />
    </DragDropContext>
  );
};

export default PublishDatatable;
