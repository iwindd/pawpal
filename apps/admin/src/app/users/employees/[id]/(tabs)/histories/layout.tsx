import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
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

  return (
    <>
      <div>
        <TabNavigation />
      </div>
      {children}
    </>
  );
};

export default CustomerLayout;
