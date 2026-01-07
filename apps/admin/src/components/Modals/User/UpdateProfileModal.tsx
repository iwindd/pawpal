"use client";
import { UpdateProfileInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import UpdateProfileForm from "../../Forms/User/UpdateProfileForm";

interface UpdateProfileModalProps {
  opened: boolean;
  onClose: () => void;
  initialValues: UpdateProfileInput;
  onSubmit: (values: UpdateProfileInput) => void;
  loading?: boolean;
}

export default function UpdateProfileModal({
  opened,
  onClose,
  initialValues,
  onSubmit,
  loading,
}: Readonly<UpdateProfileModalProps>) {
  const __ = useTranslations("User.EditProfileModal");

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} size="md">
      <UpdateProfileForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        loading={loading}
      />
    </Modal>
  );
}
