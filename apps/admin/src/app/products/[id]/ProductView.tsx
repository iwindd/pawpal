"use client";
import ProductForm from "@/components/Forms/ProductForm";
import API from "@/libs/api/client";
import { AdminProductEditResponse, ProductInput } from "@pawpal/shared";
import { Box } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface ProductViewProps {
  product: AdminProductEditResponse;
}

const ProductView = ({ product }: ProductViewProps) => {
  const queryClient = useQueryClient();
  const __ = useTranslations("Product");

  const { mutate } = useMutation({
    mutationFn: async (values: ProductInput) =>
      await API.product.update(product.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      notify.show({
        title: __("notify.updated.title"),
        message: __("notify.updated.message"),
        color: "green",
      });
    },
  });

  const onSubmit = (values: ProductInput) => {
    mutate(values);
  };

  return (
    <Box>
      <ProductForm product={product} onSubmit={onSubmit} />
    </Box>
  );
};

export default ProductView;
