import { ServerAPI } from "@/libs/api/server";
import { notFound } from "next/navigation";
import ProductView from "./ProductView";

const ProductPage = async ({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) => {
  const { slug } = await params;

  const product = await ServerAPI.product.findOneBySlug(slug);

  if (!product.success || !product.data) notFound();

  return <ProductView product={product.data} />;
};

export default ProductPage;
