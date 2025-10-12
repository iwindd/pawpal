import { z } from "zod";

export const carouselReorderSchema = z.object({
  fromIndex: z.number().min(0).max(99),
  toIndex: z.number().min(0).max(99),
  carousel_id: z.string(),
});

export type CarouselReorderInput = z.infer<typeof carouselReorderSchema>;
