"use client";
import TagForm, { CreateTagForm } from "@/components/Forms/TagForm";
import { isErrorWithStatus } from "@/features/helpers";
import { useCreateTagMutation } from "@/features/tag/tagApi";
import { TagInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface CreateTagModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function CreateTagModal({
  opened,
  onClose,
}: Readonly<CreateTagModalProps>) {
  const __ = useTranslations("Tag.CreateTagModal");
  const messages = useTranslations("Tag.messages");

  const [createTag, { isLoading, error }] = useCreateTagMutation();

  const onSubmit = async (values: TagInput) => {
    const response = await createTag(values);

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

  const form = CreateTagForm({
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
      <TagForm onSubmit={onSubmit} form={form} variant="modal" type="create" />
    </Modal>
  );
}
