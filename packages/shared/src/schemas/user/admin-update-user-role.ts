import { z } from "zod";

export const adminUpdateUserRoleSchema = z.object({
  type: z.enum(["customer", "employee"]),
  roles: z.array(z.string()).default([]),
});

export type AdminUpdateUserRoleInput = z.infer<
  typeof adminUpdateUserRoleSchema
>;
