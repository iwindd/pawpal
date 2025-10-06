import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { BaseDatatableProps } from "../datatable";
import ColumnImage from "./components/ColumnImage";

interface Props extends BaseDatatableProps<any> {}

const PublishDatatable = ({
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
  const __ = useTranslations("Datatable.product");
  const columns: DataTableProps<any>["columns"] = [
    {
      accessor: "image",
      noWrap: true,
      sortable: false,
      title: "Image",
      render: (value) => <ColumnImage {...value} />,
    },
    {
      accessor: "title",
      noWrap: true,
      sortable: true,
      title: "Title",
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
      records={records}
      fetching={fetching}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
};

export default PublishDatatable;
