import { z } from "zod";

export const DatatableQuerySchema = z
  .object({
    page: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v ? Number(v) : 1)),
    limit: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v ? Number(v) : 15)),
    search: z.string().optional(),

    "sort[columnAccessor]": z.string().optional(),
    "sort[direction]": z.enum(["asc", "desc"]).optional(),
  })
  .transform((data) => ({
    page: data.page,
    limit: data.limit,
    search: data.search,
    sort: {
      columnAccessor: data["sort[columnAccessor]"] ?? "createdAt",
      direction: data["sort[direction]"] ?? "desc",
    },
  }));

export type DatatableInput = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: {
    columnAccessor: string;
    direction: "asc" | "desc";
  };
};

/** @deprecated Use `DatatableInput` for input OR `DatatableQuery` for query */
export type DatatableQueryDto = z.infer<typeof DatatableQuerySchema>;
