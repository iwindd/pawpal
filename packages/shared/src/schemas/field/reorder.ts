import { z } from "zod";

export const FieldReorderSchema = z.object({
  fromIndex: z.number().min(0).max(99),
  toIndex: z.number().min(0).max(99),
  field_id: z.string(),
});

export type FieldReorderInput = z.infer<typeof FieldReorderSchema>;
