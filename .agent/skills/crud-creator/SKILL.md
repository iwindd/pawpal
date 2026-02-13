---
name: crud-creator
description: Comprehensive guide for creating full-stack CRUD features in the mono-repo. Covers Prisma models, Zod schemas, NestJS API (Controller/Service), Redux Toolkit Query, and Frontend UI components.
---

# CRUD Creator

This skill guides you through creating a complete Create, Read, Update, Delete (CRUD) feature set across the full stack.

## Workflow

### 1. Database Model (Prisma)

First, verify the existing data model or creating a new one.

- **Location**: `apps/api/prisma/models`
- **Action**: Read the relevant `.prisma` file to understand fields and relationships.

### 2. Validation Schemas (Shared)

Create or update Zod schemas to be shared between backend and frontend.

- **Location**: `packages/shared/src/schemas/<entity>`
- **Pattern**:
  - Use `z.object` with specific validation messages.
  - Export TypeScript types `type XInput = z.infer<typeof xSchema>`.

```typescript
import { z } from "zod";

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 20;

export const entitySchema = z.object({
  name: z
    .string()
    .min(NAME_MIN_LENGTH, "name_too_short")
    .max(NAME_MAX_LENGTH, "name_too_long"),
  // ... other fields
});

export type EntityInput = z.infer<typeof entitySchema>;
```

### 3. Backend API (NestJS)

Implement Controller and Service in `apps/api`.

- **Controller**: Use `DatatablePipe` for listing and `ZodPipe` for validation.
- **Service**: Use `prisma.<entity>.getDatatable`.

#### Controller Template

```typescript
@Controller("admin/entity")
export class EntityController {
  constructor(private readonly service: EntityService) {}

  @Get()
  getDatatable(@Query(new DatatablePipe()) query: DatatableQuery) {
    return this.service.getDatatable(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body(new ZodPipe(entitySchema)) payload: EntityInput,
    @AuthUser() user: Session,
  ) {
    return this.service.create(payload, user.id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodPipe(entitySchema)) payload: EntityInput,
    @AuthUser() user: Session,
  ) {
    return this.service.update(id, payload, user.id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
```

#### Service Datatable Pattern

```typescript
async getDatatable(query: DatatableQuery) {
  return this.prisma.entity.getDatatable({
    query,
    select: {
       // Define visible fields
       id: true,
       name: true,
       // ...
    },
    searchable: {
      name: { mode: 'insensitive' },
      // ...
    },
  });
}
```

### 4. Frontend State (Redux Toolkit)

Create an API slice in `apps/admin/src/features/<entity>/<entity>Api.ts`.

```typescript
import { baseQuery } from "@/configs/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const entityApi = createApi({
  reducerPath: "entityApi",
  tagTypes: ["Entity"],
  baseQuery: baseQuery({ baseUrl: `/admin/entity` }),
  endpoints: (builder) => ({
    getDatatable: builder.query<
      DatatableResponse<EntityResponse>,
      DatatableInput
    >({
      query: (params) => ({ url: `/`, params }),
      providesTags: ["Entity"],
    }),
    create: builder.mutation<EntityResponse, EntityInput>({
      query: (body) => ({ url: `/`, method: "POST", body }),
      invalidatesTags: ["Entity"],
    }),
    update: builder.mutation<EntityResponse, { id: string; body: EntityInput }>(
      {
        query: ({ id, body }) => ({ url: `/${id}`, method: "PATCH", body }),
        invalidatesTags: ["Entity"],
      },
    ),
    delete: builder.mutation<void, string>({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Entity"],
    }),
  }),
});

export const {
  useGetDatatableQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = entityApi;
```

### 5. Frontend UI

#### List Page (Read)

Use the **`datatable-creator`** skill to generate the list page.

#### Forms (Create/Update)

Use the **`form-component-creator`** skill to generate standard form components.

#### Delete Action

Use `useConfirmation` hook for delete actions.

```typescript
const { confirmation } = useConfirmation();

const handleDelete = (id: string) =>
  confirmation(
    async () => {
      // Call delete mutation
      const res = await deleteMutation(id);
      if (!res.error) {
        Notifications.show({ color: "green", message: "Success" });
      }
    },
    {
      title: __("confirm_delete_title"),
      message: __("confirm_delete_message"),
    },
  );
```

### 6. Shared Types

- Add `<Entity>Response` in `packages/shared/src/types/response/<entity>.ts`.
- Export it in `packages/shared/src/index.ts`.
