"use server";
import { LocaleValue } from "@/configs/locales";
import { cookies } from "next/headers";

export const setLocaleCookie = async (value: LocaleValue) => {
  const store = await cookies();
  store.set("locale", value);
};
