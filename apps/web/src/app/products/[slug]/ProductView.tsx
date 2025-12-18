"use client";
import ProductForm from "@/components/Form/ProductForm";
import PromptPayManualModal from "@/components/Modals/PromptPayManualModal";
import { useCreateOrderMutation } from "@/features/order/orderApi";
import {
  PaymentChargeCreatedResponse,
  ProductResponse,
  PurchaseInput,
} from "@pawpal/shared";
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
    const { error, data } = await createOrderMutation(values);
    backdrop.hide();

    if (error || !data) {
      return Notifications.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
    }

    if (data.type == "topup") return;

    if (data.type == "purchase") {
      Notifications.show({
        id: `order-${data.transaction.order_id}`,
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "pawpink",
        autoClose: false,
        withCloseButton: false,
        loading: true,
      });
    }
  };

  const onPurchaseSuccess = async (response: PaymentChargeCreatedResponse) => {
    if (!response.order_id) return;
    Notifications.show({
      id: `order-${response.order_id}`,
      title: __("notify.success.title"),
      message: __("notify.success.message"),
      color: "pawpink",
      autoClose: false,
      withCloseButton: false,
      loading: true,
    });
  };

  const onPurchaseError = () => {
    Notifications.show({
      title: __("notify.error.title"),
      message: __("notify.error.message"),
      color: "red",
    });
  };

  return (
    <Container py="xl">
      <ProductForm
        product={product}
        onPurchase={handleSubmit}
        isLoading={isLoading}
      />
      <PromptPayManualModal
        onSuccess={onPurchaseSuccess}
        onError={onPurchaseError}
      />
    </Container>
  );
};

export default ProductView;
