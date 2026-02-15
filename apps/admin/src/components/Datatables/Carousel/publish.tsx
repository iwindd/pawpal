import {
  useGetPublishedCarouselsQuery,
  useReorderCarouselMutation,
} from "@/features/carousel/carouselApi";
import { IconEdit } from "@pawpal/icons";
import { CarouselResponse } from "@pawpal/shared";
import { DataTable, DataTableProps, Stack, Text, Title } from "@pawpal/ui/core";
import { DragDropContext, DropResult } from "@pawpal/ui/draggable";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { DragRowFactory, DragTableWrapper } from "..";
import TableAction from "../action";
import ColumnImage from "./components/ColumnImage";

const PublishDatatable = () => {
  const __ = useTranslations("Carousel");
  const { data: publishedCarousels, isLoading } = useGetPublishedCarouselsQuery(
    {
      limit: 100,
    },
  );

  const [reorderCarouselMutation, { isLoading: isReording }] =
    useReorderCarouselMutation();
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

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const carouselId = publishedCarousels?.data[sourceIndex]?.id;

    if (sourceIndex === destinationIndex) return;
    if (isReording) return;
    if (!carouselId) return;

    const response = await reorderCarouselMutation({
      carousel_id: carouselId,
      fromIndex: sourceIndex,
      toIndex: destinationIndex,
    });

    if (response.error) {
      return Notifications.show({
        title: __("reorder.error.title"),
        message: __("reorder.error.message"),
        color: "red",
      });
    }

    Notifications.show({
      title: __("reorder.success.title"),
      message: __("reorder.success.message"),
      color: "green",
    });
  };

  if (isLoading && !publishedCarousels) return null;
  if (!publishedCarousels || publishedCarousels.data.length === 0) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <DataTable
        maxHeight={530}
        columns={columns}
        fetching={isLoading || isReording}
        records={publishedCarousels.data}
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
