"use client";
import ProductTagForm, {
  CreateProductTagForm,
} from "@/components/Forms/ProductTag";
import { useUpdateProductTagMutation } from "@/features/productApi/productTagApi";
import { ProductTagInput } from "@pawpal/shared";
import { Box, Card } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProductTag } from "../../ProductTagContext";

const ProductTagInformationPage = () => {
  const { productTag, updateProductTag } = useProductTag();
  const __ = useTranslations("ProductTag");
  const messages = useTranslations("ProductTag.messages");

  const [updateProductTagMutation, { isLoading }] =
    useUpdateProductTagMutation();

  const form = CreateProductTagForm({
    initialValues: {
      name: productTag.name,
      slug: productTag.slug,
    },
    isLoading,
  });

  const onSubmit = async (values: ProductTagInput) => {
    const { data, error } = await updateProductTagMutation({
      id: productTag.id,
      payload: values,
    });

    if (error || !data) return;

    updateProductTag(data);

    Notifications.show({
      message: messages("notify.updated", { name: values.name }),
      color: "green",
    });

    form.resetDirty();
  };
  return (
    <Box py="md">
      <Card>
        <Card.Section inheritPadding py="md">
          <ProductTagForm onSubmit={onSubmit} form={form} />
        </Card.Section>
      </Card>
    </Box>
  );
};

export default ProductTagInformationPage;
