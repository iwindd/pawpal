import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { CustomerProvider } from "./CustomerContext";
import TabNavigation from "./TabNavigation";

const CustomerLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const response = await API.user.getCustomerProfile(id);

  if (!response.success) return notFound();

  const customer = response.data;

  return (
    <CustomerProvider defaultValue={customer}>
      <PageHeader title={customer.displayName} />
      <TabNavigation />
      {children}
    </CustomerProvider>
  );
};

export default CustomerLayout;
