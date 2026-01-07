import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { EmployeeProvider } from "./EmployeeContext";
import TabNavigation from "./TabNavigation";

const EmployeeLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const response = await API.user.getEmployeeProfile(id);

  if (!response.success) return notFound();

  const employee = response.data;

  return (
    <EmployeeProvider defaultValue={employee}>
      <PageHeader title={employee.displayName} />
      <TabNavigation />
      {children}
    </EmployeeProvider>
  );
};

export default EmployeeLayout;
