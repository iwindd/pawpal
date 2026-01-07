import PageHeader from "@/components/Pages/PageHeader";
import { getTranslations } from "next-intl/server";
import TabNavigation from "./TabNavigation";

const EmployeeLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const __ = await getTranslations("Profile.main");

  return (
    <>
      <PageHeader title={__("title")} />
      <TabNavigation />
      {children}
    </>
  );
};

export default EmployeeLayout;
