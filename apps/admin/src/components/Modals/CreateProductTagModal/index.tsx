"use client";
import ProductTagForm, {
  CreateProductTagForm,
} from "@/components/Forms/ProductTag";
import { isErrorWithStatus } from "@/features/helpers";
import { useCreateProductTagMutation } from "@/features/productApi/productTagApi";
import { ProductTagInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface CreateProductTagModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateProductTagModal({
  opened,
  onClose,
}: Readonly<CreateProductTagModalProps>) {
  const __ = useTranslations("ProductTag.CreateProductTagModal");
  const messages = useTranslations("ProductTag.messages");

  const [createProductTag, { isLoading, error }] =
    useCreateProductTagMutation();

  const onSubmit = async (values: ProductTagInput) => {
    const response = await createProductTag(values);

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
  };

  const form = CreateProductTagForm({
    initialValues: {
      name: "",
      slug: "",
    },
    isLoading,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={__("title")}
      size="md"
      withCloseButton={!isLoading}
    >
      <ProductTagForm
        onSubmit={onSubmit}
        form={form}
        variant="modal"
        type="create"
      />
    </Modal>
  );
}
