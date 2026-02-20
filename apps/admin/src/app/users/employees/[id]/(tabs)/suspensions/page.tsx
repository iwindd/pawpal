import EmployeeSuspensionHistoryDatatable from "@/components/Datatables/Employee/SuspensionHistoryDatatable";

export default async function EmployeeSuspensionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeSuspensionHistoryDatatable userId={id} />;
}
