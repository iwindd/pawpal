import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { BaseDatatableProps } from "../datatable";
import ColumnImage from "./components/ColumnImage";

interface Props extends BaseDatatableProps<any> {}

const ArchiveDatatable = ({
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
      sortable: true,
      title: "Image",
      render: (value) => <ColumnImage {...value} />,
    },
    {
      accessor: "title",
      noWrap: true,
      sortable: true,
      title: "Title",
    },
    {
      accessor: "product.name",
      noWrap: true,
      sortable: true,
      title: "Product",
    },
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: "Created At",
      visibleMediaQuery: above.md,
    },
  ];

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      striped
      highlightOnHover
      height="83.4dvh"
      minHeight={400}
      maxHeight={1000}
      idAccessor="slug"
      columns={columns}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={limit}
      page={page}
      onPageChange={setPage}
      fetching={fetching}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
};

export default ArchiveDatatable;
