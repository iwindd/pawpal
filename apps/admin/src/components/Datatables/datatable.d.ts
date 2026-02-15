import { DataTableProps } from "@pawpal/ui/core";

type DatatableAbove = Record<string, (theme: MantineTheme) => string>;
export interface BaseDatatableProps<T> extends UseDatatableReturnProps<T> {
  records: T[];
  fetching?: boolean;
  totalRecords?: number;
  page: number;
  limit: number;
  sortStatus: DataTableSortStatus<T>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortStatus: (sortStatus: DataTableSortStatus<T>) => void;
}

export interface UseDataTableProps<T> {
  columns?:
    | DataTableProps<T>["columns"]
    | (({ above }: { above: DatatableAbove }) => DataTableProps<T>["columns"]);
  sortStatus?: DataTableSortStatus<T>;
  page?: number;
  limit?: number;
}

export interface UseDatatableReturnProps<T> {
  page: BaseDatatableProps<T>["page"];
  limit: BaseDatatableProps<T>["limit"];
  sortStatus: BaseDatatableProps<T>["sortStatus"];
  setPage: BaseDatatableProps<T>["setPage"];
  setLimit: BaseDatatableProps<T>["setLimit"];
  setSortStatus: BaseDatatableProps<T>["setSortStatus"];
  sort: string;

  above: DatatableAbove;

  props: Required<
    Pick<
      DataTableProps<T>,
      | "recordsPerPage"
      | "page"
      | "onPageChange"
      | "sortStatus"
      | "onSortStatusChange"
      | "columns"
    >
  >;
}
