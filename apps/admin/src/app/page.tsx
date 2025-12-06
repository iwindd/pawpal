"use client";

import { useAppSelector } from "@/hooks";
import { useTranslations } from "next-intl";

export default function Home() {
  const user = useAppSelector((state) => state.auth.user);
  const t = useTranslations();

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>Welcome to Pawpal Admin Dashboard</p>
      <p>{user.email}</p>
    </div>
  );
}
