"use client";
import CategoryForm, { CreateCategoryForm } from "@/components/Forms/Category";
import { useUpdateCategoryMutation } from "@/features/category/categoryApi";
import { CategoryInput } from "@pawpal/shared";
import { Card } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useCategory } from "../../CategoryContext";

const CategoryInformationPage = () => {
  const { category, updateCategory } = useCategory();
  const __ = useTranslations("Product.category");
  const messages = useTranslations("Product.category.messages");

  const [updateCategoryMutation, { isLoading }] = useUpdateCategoryMutation();

  const form = CreateCategoryForm({
    initialValues: {
      name: category.name,
      slug: category.slug,
    },
    isLoading,
  });

  const onSubmit = async (values: CategoryInput) => {
    const { data, error } = await updateCategoryMutation({
      id: category.id,
      body: values,
    });

    if (error || !data) return;

    updateCategory(data);

    Notifications.show({
      message: messages("notify.updated", { name: values.name }),
      color: "green",
    });

    form.resetDirty();
  };

  return (
    <Card>
      <Card.Header title={__("information")} />
      <Card.Section inheritPadding pb="md">
        <CategoryForm onSubmit={onSubmit} form={form} />
      </Card.Section>
    </Card>
  );
};

export default CategoryInformationPage;
