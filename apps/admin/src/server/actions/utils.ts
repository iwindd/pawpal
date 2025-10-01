"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const refreshHomePage = async () => {
  revalidatePath("/");
  redirect("/");
};

export default refreshHomePage;
