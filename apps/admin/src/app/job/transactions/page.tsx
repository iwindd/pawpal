"use client";
import TransactionDatatable from "@/components/Datatables/Transaction";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function TransactionsPage() {
  const __ = useTranslations("Transaction");

  return (
    <div>
      <PageHeader title={__("main.title")} />

      <Paper p={0}>
        <TransactionDatatable />
      </Paper>
    </div>
  );
}
