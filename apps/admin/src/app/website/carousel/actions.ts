"use server";
import { revalidatePath } from "next/cache";

export const refreshCarousel = async (carouselId: string) => {
  revalidatePath(`/website/carousel/${carouselId}`);
};
