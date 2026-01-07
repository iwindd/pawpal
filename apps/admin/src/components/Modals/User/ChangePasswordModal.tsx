"use client";
import { AdminResetPasswordInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import ChangePasswordForm from "../../Forms/User/ChangePasswordForm";

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: AdminResetPasswordInput) => void;
  loading?: boolean;
}

export default function ChangePasswordModal({
  opened,
  onClose,
  onSubmit,
  loading,
}: Readonly<ChangePasswordModalProps>) {
  const __ = useTranslations("User.ChangePasswordModal");

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} size="md">
      <ChangePasswordForm onSubmit={onSubmit} loading={loading} />
    </Modal>
  );
}
