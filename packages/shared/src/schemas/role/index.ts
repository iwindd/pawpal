import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "name_required").max(50, "name_too_long"),
  description: z.string().max(200, "description_too_long").optional(),
  permissions: z.array(z.string()).default([]),
});

export type RoleInput = z.infer<typeof roleSchema>;
