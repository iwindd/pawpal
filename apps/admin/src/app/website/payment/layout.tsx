import PageHeader from "@/components/Pages/PageHeader";
import { getTranslations } from "next-intl/server";
import TabNavigation from "./TabNavigation";

const WebsitePaymentLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const __ = await getTranslations("PaymentGateway");

  return (
    <>
      <PageHeader title={__("title")} />
      <TabNavigation />
      {children}
    </>
  );
};

export default WebsitePaymentLayout;
