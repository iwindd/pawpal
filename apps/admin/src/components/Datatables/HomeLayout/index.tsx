import { useGetHomeLayoutsDatatableQuery } from "@/features/home-layout/homeLayoutApi";
import useDatatable from "@/hooks/useDatatable";
import { DataTable, Text } from "@pawpal/ui/core";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import HomeLayoutStatusBadge from "../../Badges/HomeLayoutStatus";

const HomeLayoutDatatable = () => {
  const t = useTranslations("HomeLayout.datatable");

  const datatable = useDatatable<any>({
    columns: [
      {
        accessor: "version",
        title: t("version"),
        render: (row) => <Text>v{row.version}</Text>,
      },
      {
        accessor: "name",
        title: t("name"),
      },
      {
        accessor: "status",
        title: t("status"),
        render: (row) => <HomeLayoutStatusBadge status={row.status} />,
      },
      {
        accessor: "updater.displayName",
        title: t("updater"),
        render: (row) => row.updater?.displayName || "-",
      },
      /*       { TODO: Add Rollback, Preview, Duplicate
        accessor: "actions",
        title: t("actions"),
        width: 120,
        textAlign: "center",
        render: (row) => (
          <Group gap={4} justify="center" wrap="nowrap">
            <Tooltip label={t("action-edit")} position="top" withArrow>
              <ActionIcon
                component={Link}
                href={getPath("website.home.edit", { id: row.id })}
                variant="subtle"
                color="blue"
                size="md"
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      }, */
    ],
  });

  const { data, isFetching } = useGetHomeLayoutsDatatableQuery({
    page: datatable.page,
    limit: datatable.limit,
    sort: datatable.sort,
    //sortBy: "version", TODO ORDER BY VERSION
  });

  return (
    <DataTable
      fetching={isFetching}
      records={data?.data}
      idAccessor="id"
      totalRecords={data?.total}
      {...datatable.props}
    />
  );
};

export default HomeLayoutDatatable;
