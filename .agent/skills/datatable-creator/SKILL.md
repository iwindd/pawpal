---
name: datatable-creator
description: Guide for creating new datatable components in apps/admin. Use this skill when the user wants to add a list/table view for an entity in the admin panel.
---

# Datatable Creator

This skill helps you create a new datatable component in `apps/admin` following the project's standards, specifically modeled after `apps/admin/src/components/Datatables/Product/index.tsx`.

## Prerequisites

1.  **API Response Type**: Ensure the response type interface exists in `@pawpal/shared` (e.g., `Admin<Entity>Response`).
2.  **Translations**: Ensure the translation key exists in `apps/admin/messages/*.json` under `Datatable.<entity_key>`.

## Instructions

1.  **Create Directory**: Create a new directory at `apps/admin/src/components/Datatables/<EntityName>`.
2.  **Create Component**: Create `index.tsx` in the new directory.
3.  **Implement Code**: Use the template below, replacing the placeholders.

## Template: index.tsx

```tsx
"use client";
import { IconEdit } from "@pawpal/icons"; // Ensure this icon exists or choose another
import { {{ApiResponseType}} } from "@pawpal/shared"; // e.g. AdminTagResponse
import { DataTable, DataTableProps } from "@pawpal/ui/core";
import { useFormatter, useTranslations } from "next-intl";
import TableAction from "../action";
import { BaseDatatableProps } from "../datatable";

interface Props extends BaseDatatableProps<{{ApiResponseType}}> {}

const {{EntityName}}Datatable = ({
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
  const format = useFormatter();
  const __ = useTranslations("Datatable.{{TranslationKey}}"); // e.g. "productTag"

  const columns: DataTableProps<{{ApiResponseType}}>["columns"] = [
    // Example Column: Name
    {
      accessor: "name", // Change to match your API response field
      noWrap: true,
      sortable: true,
      title: __("name"),
    },
    // Example Column: Created At (Hidden on small screens)
    {
      accessor: "createdAt",
      noWrap: true,
      sortable: true,
      title: __("createdAt"),
      render: (value) => format.dateTime(new Date(value.createdAt), "date"),
      visibleMediaQuery: above.md,
    },
    // Actions Column
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      textAlign: "center",
      render: (record) => (
        <TableAction
          displayType="icon"
          actions={[
            {
              color: "blue",
              icon: IconEdit,
              action: `/{{RouteBase}}/${record.id}`, // e.g. /products/tags/${record.id}
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      idAccessor="id" // CHECK: Does your entity use 'id', 'slug', or 'uuid'?
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

export default {{EntityName}}Datatable;
```

## Checklist

- [ ] **Imports**: Verify `@pawpal/shared` imports match the actual type names.
- [ ] **Translations**: Check if `__("...")` keys exist in `messages/en.json` / `messages/th.json`.
- [ ] **Route**: Verify the `action` URL in `TableAction`.
- [ ] **Id Accessor**: Ensure `idAccessor` matches the unique identifier of the record.
