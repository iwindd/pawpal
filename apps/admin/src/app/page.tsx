"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>Welcome to Pawpal Admin Dashboard</p>
      <p>{user.email}</p>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
}
