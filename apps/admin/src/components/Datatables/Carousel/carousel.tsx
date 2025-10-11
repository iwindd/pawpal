import CarouselStatusBadge from "@/components/Badges/CarouselStatus";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
import { IconArchive, IconEdit } from "@pawpal/icons";
import { CarouselResponse } from "@pawpal/shared";
import { DataTable, DataTableProps, Stack, Text, Title } from "@pawpal/ui/core";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";
import ColumnImage from "./components/ColumnImage";

interface Props extends BaseDatatableProps<any> {}

const CarouselDatatable = () => {
  const formatter = useFormatter();
  const __ = useTranslations("Datatable.carousel");
  const { above, ...datatable } = useDatatable<CarouselResponse>({
    sortStatus: API.carousel.DEFAULT_SORT,
    limit: 6,
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "carousels",
      datatable.page,
      datatable.limit,
      datatable.sortStatus,
    ],
    queryFn: () =>
      API.carousel.findAll({
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
      }),
  });

  const columns: DataTableProps<CarouselResponse>["columns"] = [
    {
      accessor: "image.url",
      noWrap: true,
      sortable: false,
      title: __("image"),
      render: (value) => (
        <ColumnImage image={value.image.url} title={value.title} />
      ),
      width: 100,
    },
    {
      accessor: "title",
      noWrap: true,
      sortable: true,
      textAlign: "left",
      title: __("title"),
      render: (value) => {
        return (
          <Stack gap={0} justify="center">
            <Title order={4}>{value.title}</Title>
            <Text size="xs" c="dimmed">
              {value.product?.name}
            </Text>
          </Stack>
        );
      },
    },
    {
      accessor: "status",
      noWrap: true,
      sortable: true,
      title: __("status"),
      render: ({ status }) => <CarouselStatusBadge status={status} />,
    },
    {
      accessor: "updatedAt",
      noWrap: true,
      sortable: true,
      title: __("updatedAt"),
      render: (value) =>
        formatter.dateTime(new Date(value.updatedAt), "dateTime"),
    },
    {
      accessor: "creator.displayName",
      noWrap: true,
      sortable: true,
      title: __("creator"),
    },
    {
      accessor: "actions",
      title: __("actions"),
      textAlign: "center",
      render: (carousel) => (
        <TableAction
          label={__("actions")}
          actions={[
            {
              translate: "edit",
              action: `/website/carousel/${carousel.id}`,
              icon: IconEdit,
            },
            {
              translate: "archive",
              action: () => {},
              props: {
                disabled: true,
              },
              icon: IconArchive,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      striped
      highlightOnHover
      height={572}
      columns={columns}
      fetching={isFetching}
      records={data?.data.data || []}
      totalRecords={data?.data.total || 0}
      recordsPerPage={datatable.limit}
      onPageChange={datatable.setPage}
      page={datatable.page}
      sortStatus={datatable.sortStatus}
      onSortStatusChange={datatable.setSortStatus}
    />
  );
};

export default CarouselDatatable;
