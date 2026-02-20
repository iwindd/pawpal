"use client";
import ProductForm, {
  ProductFormControl,
} from "@/components/Forms/ProductForm";
import { useUpdateProductMutation } from "@/features/productApi/productApi";
import { ProductInput } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const ProductInformationPage = () => {
  const { product, updateProduct } = useProduct();
  const __ = useTranslations("Product");
  const [updateProductMutation, { isLoading, error }] =
    useUpdateProductMutation();

  const onSubmit = async (payload: ProductInput, form: ProductFormControl) => {
    const { data, error } = await updateProductMutation({
      id: product.id,
      product: payload,
    });

    if (error || !data) return;

    updateProduct(data);

    notify.show({
      message: __("notify.updated.message"),
      color: "green",
    });

    form.setFieldValue("image_id", data.image.id);
    form.resetDirty();
  };

  return (
    <ProductForm
      product={product}
      isLoading={isLoading}
      onSubmit={onSubmit}
      errorMessage={error && "error"}
    />
  );
};

export default ProductInformationPage;
