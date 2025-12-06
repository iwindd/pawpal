import CarouselStatusBadge from "@/components/Badges/CarouselStatus";
import { useGetCarouselsQuery } from "@/features/carousel/carouselApi";
import useDatatable from "@/hooks/useDatatable";
import { IconArchive, IconEdit } from "@pawpal/icons";
import { CarouselResponse } from "@pawpal/shared";
import {
  DataTable,
  DataTableProps,
  Group,
  Stack,
  Text,
  Title,
} from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import TableAction from "../action";
import TableSearch from "../search";
import ColumnImage from "./components/ColumnImage";

const CarouselDatatable = () => {
  const formatter = useFormatter();
  const __ = useTranslations("Datatable.carousel");
  const [search, setSearch] = useState<string>("");
  const { above, ...datatable } = useDatatable<CarouselResponse>({
    sortStatus: {
      columnAccessor: "status",
      direction: "asc",
    },
    limit: 10,
  });

  const { data, isLoading } = useGetCarouselsQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sortStatus,
    search,
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
      visibleMediaQuery: above.sm,
    },
    {
      accessor: "updatedAt",
      noWrap: true,
      sortable: true,
      title: __("updatedAt"),
      render: (value) =>
        formatter.dateTime(new Date(value.updatedAt), "dateTime"),
      visibleMediaQuery: above.md,
    },
    {
      accessor: "creator.displayName",
      noWrap: true,
      sortable: true,
      title: __("creator"),
      visibleMediaQuery: above.md,
    },
    {
      accessor: "actions",
      title: __("actions"),
      textAlign: "center",
      render: (carousel) => (
        <TableAction
          displayType="icon"
          align="center"
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
    <>
      <Group>
        <div>
          <TableSearch onSearch={setSearch} />
        </div>
      </Group>
      <DataTable
        striped
        highlightOnHover
        height={670}
        scrollAreaProps={{ type: "never" }}
        columns={columns}
        fetching={isLoading}
        records={data?.data || []}
        totalRecords={data?.total || 0}
        recordsPerPage={datatable.limit}
        onPageChange={datatable.setPage}
        page={datatable.page}
        sortStatus={datatable.sortStatus}
        onSortStatusChange={datatable.setSortStatus}
      />
    </>
  );
};

export default CarouselDatatable;
