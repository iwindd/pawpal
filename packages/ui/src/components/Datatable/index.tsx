import {
  DataTable as MantineDataTable,
  DataTableProps as MantineDataTableProps,
} from "mantine-datatable";
import React from "react";

export function DataTable<T>(
  props: MantineDataTableProps<T>,
): React.JSX.Element {
  return (
    <MantineDataTable
      withTableBorder
      borderRadius="sm"
      highlightOnHover
      height={690}
      {...props}
    />
  );
}

export {
  DataTableDraggableRow,
  type DataTableColumn,
  type DataTableProps,
  type DataTableSortStatus,
} from "mantine-datatable";
