"use client";
import { AddButton } from "@/components/Button/AddButton";
import EmployeeDatatable from "@/components/Datatables/Employee";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const __ = useTranslations("Employee");

  return (
    <>
      <PageHeader title={__("main.title")}>
        <AddButton component={Link} href="/users/create?type=employee">
          {__("main.add-btn")}
        </AddButton>
      </PageHeader>

      <Paper p={0}>
        <EmployeeDatatable />
      </Paper>
    </>
  );
}
