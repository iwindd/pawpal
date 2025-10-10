import { z } from "zod";

const MAX_TITLE_LENGTH = 30;
const MIN_TITLE_LENGTH = 3;

export const carouselSchema = z.object({
  resource_id: z.string().min(1, { message: "invalid_resource" }).trim(),
  title: z
    .string()
    .min(MIN_TITLE_LENGTH, { message: "title_too_short" })
    .max(MAX_TITLE_LENGTH, { message: "title_too_long" })
    .trim(),
  product_id: z.string().optional().nullable(),
});

export type CarouselInput = z.infer<typeof carouselSchema>;
