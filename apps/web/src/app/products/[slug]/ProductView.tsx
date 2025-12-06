"use client";
import ProductForm from "@/components/Form/ProductForm";
import { useCreateOrderMutation } from "@/features/order/orderApi";
import { ProductResponse, PurchaseInput } from "@pawpal/shared";
import { backdrop } from "@pawpal/ui/backdrop";
import { Container } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface ProductViewProps {
  product: ProductResponse;
}

const ProductView = ({ product }: ProductViewProps) => {
  const __ = useTranslations("ProductDetail");
  const [createOrderMutation, { isLoading }] = useCreateOrderMutation();

  const handleSubmit = async (values: PurchaseInput) => {
    backdrop.show({
      text: __("processing"),
    });
    const response = await createOrderMutation(values);
    backdrop.hide();

    if (response.error) {
      Notifications.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });

      return;
    }

    Notifications.show({
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "green",
    });
  };

  return (
    <Container py="xl">
      <ProductForm
        product={product}
        onPurchase={handleSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default ProductView;
