"use server";
import { revalidatePath } from "next/cache";

export const refreshProduct = async (productId: string) => {
  revalidatePath(`/website/products/${productId}`);
};
