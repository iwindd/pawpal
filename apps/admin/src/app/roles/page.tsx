"use client";
import { AddButton } from "@/components/Button/AddButton";
import RoleDatatable from "@/components/Datatables/Role";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function RolesPage() {
  const __ = useTranslations("Role");

  return (
    <main>
      <PageHeader title={__("main.title")}>
        <AddButton component={Link} href="/roles/create">
          {__("main.add-btn")}
        </AddButton>
      </PageHeader>

      <Paper p={0}>
        <RoleDatatable />
      </Paper>
    </main>
  );
}
