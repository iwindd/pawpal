import { z } from "zod";
import {
  DatatableInput,
  DatatableQuerySchema,
  DatatableQueryShape,
} from "./DatatableQueryParam";

// Product-specific query shape - extends base with product filters
export const ProductDatatableQueryShape = DatatableQueryShape.extend({
  types: z.union([z.string(), z.array(z.string())]).optional(),
  platforms: z.union([z.string(), z.array(z.string())]).optional(),
  categories: z.union([z.string(), z.array(z.string())]).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});

// Product-specific schema - extends base with product filter transformations
export const ProductDatatableQuerySchema = ProductDatatableQueryShape.transform(
  (data) => {
    // Get base transformation
    const baseResult = DatatableQuerySchema.parse(data);

    // Add product-specific transformations
    return {
      ...baseResult,
      types: Array.isArray(data.types)
        ? data.types
        : data.types
          ? [data.types]
          : undefined,
      platforms: Array.isArray(data.platforms)
        ? data.platforms
        : data.platforms
          ? [data.platforms]
          : undefined,
      categories: Array.isArray(data.categories)
        ? data.categories
        : data.categories
          ? [data.categories]
          : undefined,
      tags: Array.isArray(data.tags)
        ? data.tags
        : data.tags
          ? [data.tags]
          : undefined,
    };
  },
);

// Product-specific input type - extends base with product filters
export type ProductDatatableInput = DatatableInput & {
  types?: string[];
  platforms?: string[];
  categories?: string[];
  tags?: string[];
};
