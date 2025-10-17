import { z } from "zod";

const PACKAGE_NAME_MIN_LENGTH = 3;
const PACKAGE_NAME_MAX_LENGTH = 20;

export const packageSchema = z.object({
  name: z
    .string()
    .min(PACKAGE_NAME_MIN_LENGTH, "package_name_too_short")
    .max(PACKAGE_NAME_MAX_LENGTH, "package_name_too_long"),
  price: z.number().min(0, "price_must_be_positive"),
  description: z.string().optional(),
});

const PRODUCT_NAME_MIN_LENGTH = 3;
const PRODUCT_NAME_MAX_LENGTH = 20;
const PRODUCT_SLUG_MIN_LENGTH = 3;
const PRODUCT_SLUG_MAX_LENGTH = 20;
const PRODUCT_DESCRIPTION_MAX_LENGTH = 150;

export const productSchema = z.object({
  name: z
    .string()
    .min(PRODUCT_NAME_MIN_LENGTH, "product_name_too_short")
    .max(PRODUCT_NAME_MAX_LENGTH, "product_name_too_long"),
  slug: z
    .string()
    .min(PRODUCT_SLUG_MIN_LENGTH, "product_slug_too_short")
    .max(PRODUCT_SLUG_MAX_LENGTH, "product_slug_too_long"),
  description: z
    .string()
    .max(PRODUCT_DESCRIPTION_MAX_LENGTH, "product_description_too_long")
    .optional(),
  category_id: z.string().min(1, "invalid_category_id"),
  image_id: z.string().min(1),
});

export type ProductInput = z.infer<typeof productSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
