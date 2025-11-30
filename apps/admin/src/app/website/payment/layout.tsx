import PageHeader from "@/components/Pages/PageHeader";
import TabNavigation from "./TabNavigation";

const WebsitePaymentLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <PageHeader title={"payment"} />
      <TabNavigation />
      {children}
    </>
  );
};

export default WebsitePaymentLayout;
