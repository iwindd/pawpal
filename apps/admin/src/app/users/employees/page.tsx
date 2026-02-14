"use client";
import EmployeeDatatable from "@/components/Datatables/Employee";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const __ = useTranslations("Employee");

  return (
    <>
      <PageHeader title={__("main.title")} />

      <Paper p={0}>
        <EmployeeDatatable />
      </Paper>
    </>
  );
}
