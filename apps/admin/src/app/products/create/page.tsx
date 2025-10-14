"use client";
import ProductForm from "@/components/Forms/ProductForm";
import PageHeader from "@/components/Pages/PageHeader";
import { ROUTES } from "@/configs/route";
import API from "@/libs/api/client";
import { ProductInput } from "@pawpal/shared";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProductPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const __ = useTranslations("Product");

  const createMutation = useMutation({
    mutationFn: (data: ProductInput) => API.product.create(data),
    onSuccess: (response) => {
      if (response.success) {
        router.push((ROUTES.products?.path as string) || "/products");
      } else {
        setErrorMessage("Failed to create product. Please try again.");
      }
    },
    onError: () => {
      setErrorMessage("Failed to create product. Please try again.");
    },
  });

  const handleSubmit = (values: ProductInput) => {
    setErrorMessage(null);
    createMutation.mutate(values);
  };

  return (
    <div>
      <PageHeader title={__("create.title")} />

      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        errorMessage={errorMessage}
      />
    </div>
  );
}
