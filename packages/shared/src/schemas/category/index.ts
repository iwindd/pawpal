import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Category name is required").optional(),
  slug: z.string().min(1, "Category slug is required").optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
