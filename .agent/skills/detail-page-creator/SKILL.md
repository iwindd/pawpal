---
name: detail-page-creator
description: Framework for creating efficient detail pages in Next.js using Server Layouts for initial data fetching and Client Context for state management. Use this skill when users want to create detail pages for entities (e.g., /products/[id], /users/[id]).
---

# Detail Page Creator

This skill provides a standardized way to create detail pages in Next.js applications (e.g., `apps/admin`).
It follows the pattern of using a Server Component Layout to fetch initial data and passing it to a Client Component Context for state management.

## When to Use

Use this skill when the user wants to create a detail page for a specific entity, such as:

- Product Details (`/products/[id]`)
- Customer Details (`/users/customers/[id]`)
- Employee Details (`/users/employees/[id]`)
- Order Details (`/orders/[id]`)

## Implementation Guide

### 1. Create Directory Structure

Ensure the directory structure exists for the feature.
Example for `Product`: methods should correspond to a folder `apps/admin/src/app/products/[id]`.

### 2. Create `Context.tsx`

Use the `assets/context.tsx.template` template.

- Replace `{{Feature}}` with the PascalCase feature name (e.g., `Product`).
- Replace `{{featureLower}}` with the camelCase feature name (e.g., `product`).
- Replace `{{ResponseType}}` with the shared response type (e.g., `AdminProductResponse`).

### 3. Create `layout.tsx`

Use the `assets/layout.tsx.template` template.

- Replace `{{Feature}}` and `{{featureLower}}` as above.
- Replace `{{apiEndpoint}}` with the API client endpoint (e.g., `product`).
- Ensure `APISession` is imported correctly.

### 4. Create `page.tsx`

Use the `assets/page.tsx.template` template or create a custom one.

- Consume the context using `use{{Feature}}()`.
- Display the data.

## Template References

### Context Template (`assets/context.tsx`)

```typescript
"use client";
import { {{ResponseType}} } from "@pawpal/shared";
import { createContext, useContext, useState } from "react";

const {{Feature}}Context = createContext<{
  {{featureLower}}: {{ResponseType}};
  update{{Feature}}: (new{{Feature}}: {{ResponseType}}) => void;
} | null>(null);

export const {{Feature}}Provider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: {{ResponseType}};
}) => {
  const [value, setValue] = useState<{{ResponseType}}>(defaultValue);

  return (
    <{{Feature}}Context.Provider
      value={{
        {{featureLower}}: value || defaultValue,
        update{{Feature}}: (new{{Feature}}: {{ResponseType}}) => {
          setValue(new{{Feature}});
        },
      }}
    >
      {children}
    </{{Feature}}Context.Provider>
  );
};

export const use{{Feature}} = () => {
  const ctx = useContext({{Feature}}Context);
  if (!ctx) throw new Error("use{{Feature}} must be used inside {{Feature}}Provider");
  return ctx;
};
```

### Layout Template (`assets/layout.tsx`)

```typescript
import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { {{Feature}}Provider } from "./{{Feature}}Context";

const {{Feature}}Layout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const {{featureLower}} = await API.{{apiEndpoint}}.findOne(id);

  if (!{{featureLower}}.success) return notFound();

  return (
    <{{Feature}}Provider defaultValue={{{featureLower}}.data}>
      <PageHeader title={{{featureLower}}.data.name} />
      {children}
    </{{Feature}}Provider>
  );
};

export default {{Feature}}Layout;
```
