"use client";
import { AddButton } from "@/components/Button/AddButton";
import CustomerDatatable from "@/components/Datatables/Customer";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function UsersPage() {
  const __ = useTranslations("Customer");

  return (
    <div>
      <PageHeader title={__("main.title")}>
        <AddButton component={Link} href="/users/create">
          {__("main.add-btn")}
        </AddButton>
      </PageHeader>

      <Paper p={0}>
        <CustomerDatatable />
      </Paper>
    </div>
  );
}
