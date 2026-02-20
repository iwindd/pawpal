"use client";

import CreateUserForm from "@/components/Forms/CreateUserForm";
import PageHeader from "@/components/Pages/PageHeader";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function CreateUserPage() {
  const __ = useTranslations("CreateUser");
  const searchParams = useSearchParams();
  const defaultType =
    (searchParams.get("type") as "customer" | "employee") ?? "customer";

  return (
    <>
      <PageHeader title={__("main.title")} />
      <CreateUserForm defaultType={defaultType} />
    </>
  );
}
