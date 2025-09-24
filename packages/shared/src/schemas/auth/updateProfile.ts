import { z } from "zod";

const MIN_DISPLAY_NAME_LENGTH = 6;
const MAX_DISPLAY_NAME_LENGTH = 30;

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(MIN_DISPLAY_NAME_LENGTH, { message: "display_name_too_short" })
    .max(MAX_DISPLAY_NAME_LENGTH, { message: "display_name_too_long" })
    .trim(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
