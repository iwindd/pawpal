"use client";
import OrderDatatable from "@/components/Datatables/Order";
import PageHeader from "@/components/Pages/PageHeader";
import { Paper } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const __ = useTranslations("Order");

  return (
    <div>
      <PageHeader title={__("main.title")} />

      <Paper p={0}>
        <OrderDatatable />
      </Paper>
    </div>
  );
}
