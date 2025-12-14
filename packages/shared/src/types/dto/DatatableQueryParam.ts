import { z } from "zod";

export const DatatableQuerySchema = z
  .object({
    page: z.union([z.string(), z.number()]).optional(),
    limit: z.union([z.string(), z.number()]).optional(),
    search: z.string().optional(),

    sort: z.string().optional(),
  })
  .transform((data) => {
    let sort = {
      columnAccessor: "createdAt",
      direction: "desc",
    };

    if (data.sort) {
      try {
        sort = JSON.parse(data.sort);
      } catch {}
    }

    return {
      page: data.page ? Number(data.page) : 1,
      limit: data.limit ? Number(data.limit) : 15,
      search: data.search,
      sort,
    };
  });

export type DatatableInput = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export type DatatableSortParsed = {
  columnAccessor: string;
  direction: string;
};

/** @deprecated Use `DatatableInput` for input OR `DatatableQuery` for query */
export type DatatableQueryDto = z.infer<typeof DatatableQuerySchema>;
