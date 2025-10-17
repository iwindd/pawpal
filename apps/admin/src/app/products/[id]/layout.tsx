import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import { ProductProvider } from "./ProductContext";
import TabNavigation from "./TabNavigation";

const ProductLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const API = await APISession();
  const product = await API.product.findOne(id);

  if (!product.success) return notFound();

  return (
    <ProductProvider value={product.data}>
      <PageHeader title={product.data.name} />
      <TabNavigation />
      {children}
    </ProductProvider>
  );
};

export default ProductLayout;
