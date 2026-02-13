import { z } from "zod";

export const ProductTagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
});

export type ProductTagInput = z.infer<typeof ProductTagSchema>;

export type CreateProductTagInput = z.infer<typeof ProductTagSchema>;
export type UpdateProductTagInput = z.infer<typeof ProductTagSchema>;
