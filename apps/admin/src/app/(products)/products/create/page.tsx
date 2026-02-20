"use client";
import ProductForm from "@/components/Forms/ProductForm";
import PageHeader from "@/components/Pages/PageHeader";
import { getPath } from "@/configs/route";
import { useCreateProductMutation } from "@/features/productApi/productApi";
import { ProductInput } from "@pawpal/shared";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Box } from "@pawpal/ui/core";

export default function CreateProductPage() {
  const router = useRouter();
  const __ = useTranslations("Product");
  const [createProduct, { isLoading, error }] = useCreateProductMutation();

  const handleSubmit = async (payload: ProductInput) => {
    const { data: product, error } = await createProduct(payload);

    if (error || !product) return;
    router.push(
      getPath("products.packages", {
        id: product.id,
      }),
    );
  };

  return (
    <Box pb={80}>
      <PageHeader title={__("create.title")} />

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={error && "error"}
      />
    </Box>
  );
}
