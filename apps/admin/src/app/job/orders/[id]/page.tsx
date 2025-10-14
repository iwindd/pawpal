import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import OrderView from "./OrderView";

const OrderPage = async ({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) => {
  const { id } = await params;

  const API = await APISession();
  const order = await API.order.getOrder(id);
  const locale = await getTranslations("Order");

  if (!order.success) return notFound();

  return (
    <div>
      <PageHeader
        title={locale("edit.title", {
          id: order.data.id.slice(-8),
        })}
      />
      <OrderView order={order.data} />
    </div>
  );
};

export default OrderPage;
