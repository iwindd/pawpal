import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import ProductView from "./ProductView";

const ProductPage = async ({params} :{params: Promise<{id: string}>}) => {
  const { id } = await params;
  const API = await APISession();
  const product = await API.product.findOne(id);

  if (!product.success) return notFound();

  return (
    <div>
      <PageHeader title={product.data.name} />
      <ProductView product={product.data} />
    </div>
  )
}

export default ProductPage;
