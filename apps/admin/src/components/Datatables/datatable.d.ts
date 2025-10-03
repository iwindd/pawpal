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

export interface UseDatatableReturnProps<T> {
  page: BaseDatatableProps<T>["page"];
  limit: BaseDatatableProps<T>["limit"];
  sortStatus: BaseDatatableProps<T>["sortStatus"];
  setPage: BaseDatatableProps<T>["setPage"];
  setLimit: BaseDatatableProps<T>["setLimit"];
  setSortStatus: BaseDatatableProps<T>["setSortStatus"];

  above: Record<string, (theme: MantineTheme) => string>;
}
