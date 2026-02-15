import {
  UseDataTableProps,
  UseDatatableReturnProps,
} from "@/components/Datatables/datatable";
import { DataTableSortStatus, MantineTheme } from "@pawpal/ui/core";
import { useMemo, useState } from "react";

const useDatatable = <T>(
  props: UseDataTableProps<T> = {
    page: 1,
    limit: 10,
  },
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

  const above = useMemo(() => {
    return {
      xs: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.xs})`,
      sm: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.sm})`,
      md: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.md})`,
      lg: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.lg})`,
      xl: (theme: MantineTheme) => `(min-width: ${theme.breakpoints.xl})`,
    };
  }, []);

  const columns = useMemo(() => {
    if (typeof props.columns === "function") {
      return props.columns({ above });
    }
    return props.columns;
  }, [props.columns, above]);

  const datatableProps = useMemo(() => {
    const datatableProps = {
      recordsPerPage: 15,
      page,
      onPageChange: setPage,
      sortStatus,
      onSortStatusChange: handleSortStatusChange,
      columns,
    };

    return datatableProps as UseDatatableReturnProps<T>["props"];
  }, [page, sortStatus, columns, props.columns]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    sortStatus,
    setSortStatus: handleSortStatusChange,
    sort: JSON.stringify(sortStatus),
    above,
    props: datatableProps,
  };
};

export default useDatatable;
