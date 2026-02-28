import { z } from "zod";

export const stockMovementTypeSchema = z.enum(["ORDER", "ADJUST"]);

export const stockMovementListItemSchema = z.object({
  id: z.string(),
  type: stockMovementTypeSchema,
  quantity: z.number().int(),
  note: z.string().nullable().optional(),
  createdAt: z.string(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  order: z
    .object({
      id: z.string(),
    })
    .nullable()
    .optional(),
});

export type StockMovementType = z.infer<typeof stockMovementTypeSchema>;
export type StockMovementListItem = z.infer<typeof stockMovementListItemSchema>;
