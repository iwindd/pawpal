import CustomerSuspensionHistoryDatatable from "@/components/Datatables/Customer/SuspensionHistoryDatatable";

export default async function CustomerSuspensionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerSuspensionHistoryDatatable userId={id} />;
}
