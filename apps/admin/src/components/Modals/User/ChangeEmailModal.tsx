"use client";
import { AdminResetEmailInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import ChangeEmailForm from "../../Forms/User/ChangeEmailForm";

interface ChangeEmailModalProps {
  opened: boolean;
  onClose: () => void;
  initialValues: AdminResetEmailInput;
  onSubmit: (values: AdminResetEmailInput) => void;
  loading?: boolean;
}

export default function ChangeEmailModal({
  opened,
  onClose,
  initialValues,
  onSubmit,
  loading,
}: Readonly<ChangeEmailModalProps>) {
  const __ = useTranslations("User.ChangeEmailModal");

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} size="md">
      <ChangeEmailForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        loading={loading}
      />
    </Modal>
  );
}
