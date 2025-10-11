import API from "@/libs/api/client";
import { CarouselResponse } from "@pawpal/shared";
import { DataTable, DataTableProps, Stack, Text, Title } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import ColumnImage from "./components/ColumnImage";

const PublishDatatable = () => {
  const { data, isFetching } = useQuery({
    queryKey: ["carousels", "published"],
    queryFn: () => API.carousel.getPublished(),
  });

  const columns: DataTableProps<CarouselResponse>["columns"] = [
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
            <Title order={3}>{value.title}</Title>
            <Text size="xs" c="dimmed">
              {value.product?.name}
            </Text>
          </Stack>
        );
      },
    },
  ];

  return (
    <DataTable
      withTableBorder
      striped
      highlightOnHover
      height={530}
      minHeight={530}
      columns={columns}
      fetching={isFetching}
      records={data?.data.data || []}
      noHeader
    />
  );
};

export default PublishDatatable;
