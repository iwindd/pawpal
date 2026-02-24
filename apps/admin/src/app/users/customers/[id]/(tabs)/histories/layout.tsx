import APISession from "@/libs/api/server";
import { Stack } from "@pawpal/ui/core";
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
    <Stack gap="xs">
      <div>
        <TabNavigation />
      </div>
      {children}
    </Stack>
  );
};

export default CustomerLayout;
