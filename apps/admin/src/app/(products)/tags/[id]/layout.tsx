import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { ProductTagProvider } from "./ProductTagContext";
import TabNavigation from "./TabNavigation";

const ProductTagLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const productTag = await API.productTag.findOne(id);

  console.log(productTag.data);
  if (!productTag.success) return notFound();

  return (
    <ProductTagProvider defaultValue={productTag.data}>
      <PageHeader title={productTag.data.name} />
      <TabNavigation />
      {children}
    </ProductTagProvider>
  );
};

export default ProductTagLayout;
