import { z } from "zod";

const MAX_TITLE_LENGTH = 30;
const MIN_TITLE_LENGTH = 3;

export type CarouselStatus = "DRAFT" | "ARCHIVED" | "PUBLISHED";
export const ENUM_CAROUSEL_STATUS: Record<CarouselStatus, CarouselStatus> = {
  DRAFT: "DRAFT",
  ARCHIVED: "ARCHIVED",
  PUBLISHED: "PUBLISHED",
};

export const carouselSchema = z.object({
  resource_id: z.string().min(1, { message: "invalid_resource" }).trim(),
  title: z
    .string()
    .min(MIN_TITLE_LENGTH, { message: "title_too_short" })
    .max(MAX_TITLE_LENGTH, { message: "title_too_long" })
    .trim(),
  product_id: z.string().optional().nullable(),
  status: z.enum([
    ENUM_CAROUSEL_STATUS.DRAFT,
    ENUM_CAROUSEL_STATUS.ARCHIVED,
    ENUM_CAROUSEL_STATUS.PUBLISHED,
  ]),
});

export type CarouselInput = z.infer<typeof carouselSchema>;
