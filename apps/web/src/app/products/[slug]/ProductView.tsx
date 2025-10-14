"use client";
import ProductForm from "@/components/Form/ProductForm";
import API from "@/libs/api/client";
import { ProductResponse, PurchaseInput } from "@pawpal/shared";
import { backdrop } from "@pawpal/ui/backdrop";
import { Container } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface ProductViewProps {
  product: ProductResponse;
}

const ProductView = ({ product }: ProductViewProps) => {
  const __ = useTranslations("ProductDetail");
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: PurchaseInput) => {
      backdrop.show({
        text: __("processing"),
      });

      console.log(values);

      return API.order.createOrder(values);
    },

    onSuccess: () => {
      Notifications.show({
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "green",
      });
    },
    onError: (error) => {
      Notifications.show({
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "green",
      });
      console.error("Purchase failed:", error);
    },
    onSettled: () => {
      backdrop.hide();
    },
  });

  const handleSubmit = async (values: PurchaseInput) => {
    mutate(values);
  };

  return (
    <Container py="xl">
      <ProductForm
        product={product}
        onPurchase={handleSubmit}
        isLoading={isPending}
      />
    </Container>
  );
};

export default ProductView;
