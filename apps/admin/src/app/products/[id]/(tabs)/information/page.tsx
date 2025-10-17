"use client";
import { refreshProduct } from "@/app/products/actions";
import ProductForm, {
  ProductFormControl,
} from "@/components/Forms/ProductForm";
import API from "@/libs/api/client";
import { ProductInput } from "@pawpal/shared";
import { Box } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProduct } from "../../ProductContext";

const ProductInformationPage = () => {
  const queryClient = useQueryClient();
  const product = useProduct();
  const __ = useTranslations("Product");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ProductInput) =>
      await API.product.update(product.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      refreshProduct(product.id);
      notify.show({
        title: __("notify.updated.title"),
        message: __("notify.updated.message"),
        color: "green",
      });
    },
    onError: () => {
      setErrorMessage("error");
    },
  });

  const onSubmit = (values: ProductInput, form: ProductFormControl) => {
    mutate(values, {
      onSuccess: () => {
        form.resetDirty();
      },
    });
  };

  return (
    <Box py="md">
      <ProductForm
        product={product}
        isLoading={isPending}
        onSubmit={onSubmit}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default ProductInformationPage;
