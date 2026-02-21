import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { TransactionProvider } from "./TransactionContext";

const TransactionLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const transaction = await API.transaction.getTransaction(id);

  if (!transaction.success) return notFound();

  return (
    <TransactionProvider defaultValue={transaction.data}>
      <PageHeader title={`Transaction #${transaction.data.id.slice(-8)}`} />
      {children}
    </TransactionProvider>
  );
};

export default TransactionLayout;
