import { z } from "zod";

export const TagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
});

export type TagInput = z.infer<typeof TagSchema>;

export type CreateTagInput = z.infer<typeof TagSchema>;
export type UpdateTagInput = z.infer<typeof TagSchema>;
