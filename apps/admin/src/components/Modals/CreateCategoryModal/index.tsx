"use client";
import CategoryForm, { CreateCategoryForm } from "@/components/Forms/Category";
import { useCreateCategoryMutation } from "@/features/category/categoryApi";
import { isErrorWithStatus } from "@/features/helpers";
import { CategoryInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface CreateCategoryModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateCategoryModal({
  opened,
  onClose,
}: Readonly<CreateCategoryModalProps>) {
  const __ = useTranslations("Product.category.CreateCategoryModal");
  const messages = useTranslations("Product.category.messages");

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const form = CreateCategoryForm({
    initialValues: {
      name: "",
      slug: "",
    },
    isLoading,
  });

  const onSubmit = async (values: CategoryInput) => {
    const response = await createCategory(values);

    if (response.error) {
      const status = isErrorWithStatus(response.error) && response.error.status;

      if (status == 409) {
        form.setErrors({
          slug: "already_exist",
        });
      }

      return;
    }

    Notifications.show({
      message: messages("notify.created", { name: values.name }),
      color: "green",
    });

    onClose();
    form.reset();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={__("title")}
      size="md"
      withCloseButton={!isLoading}
    >
      <CategoryForm onSubmit={onSubmit} form={form} />
    </Modal>
  );
}
