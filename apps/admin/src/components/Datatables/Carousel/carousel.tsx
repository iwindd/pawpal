import CarouselStatusBadge from "@/components/Badges/CarouselStatus";
import useDatatable from "@/hooks/useDatatable";
import API from "@/libs/api/client";
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
import { useQuery } from "@tanstack/react-query";
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
    sortStatus: API.carousel.DEFAULT_SORT,
    limit: 10,
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      "carousels",
      datatable.page,
      datatable.limit,
      datatable.sortStatus,
      search,
    ],
    queryFn: () =>
      API.carousel.findAll({
        page: datatable.page,
        limit: datatable.limit,
        sort: datatable.sortStatus,
        search,
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
        fetching={isFetching}
        records={data?.data.data || []}
        totalRecords={data?.data.total || 0}
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
