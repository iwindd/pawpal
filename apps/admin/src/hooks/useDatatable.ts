import { UseDatatableReturnProps } from "@/components/Datatables/datatable";
import { DataTableSortStatus, MantineTheme } from "@pawpal/ui/core";
import { useState } from "react";

interface Props<T> {
  sortStatus?: DataTableSortStatus<T>;
  page?: number;
  limit?: number;
}

const useDatatable = <T>(
  props: Props<T> = {
    sortStatus: {
      columnAccessor: "name",
      direction: "asc",
    },
    page: 1,
    limit: 15,
  }
): UseDatatableReturnProps<T> => {
  const [page, setPage] = useState(props.page ?? 1);
  const [limit, setLimit] = useState(props.limit ?? 10);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: props.sortStatus?.columnAccessor as string,
    direction: props.sortStatus?.direction as "asc" | "desc",
  });

  const handleSortStatusChange = (sortStatus: DataTableSortStatus<T>) => {
    setPage(1);
    setSortStatus(sortStatus);
  };

  return {
    page,
    limit,
    setPage,
    setLimit,
    sortStatus,
    setSortStatus: handleSortStatusChange,
    above: {
      xs: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.xs})`,
      sm: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.sm})`,
      md: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.md})`,
      lg: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.lg})`,
      xl: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.xl})`,
    },
  };
};

export default useDatatable;
