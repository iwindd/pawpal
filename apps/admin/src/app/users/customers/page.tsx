"use client";
import CustomerDatatable from "@/components/Datatables/Customer";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const __ = useTranslations("Customer");

  return (
    <div>
      <PageHeader title={__("main.title")} />

      <Paper p={0}>
        <CustomerDatatable />
      </Paper>
    </div>
  );
}
