"use client";
import { Modal } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import SuspendUserForm from "../../Forms/User/SuspendUserForm";

interface SuspendUserModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: { note?: string }) => void;
  loading?: boolean;
  type: "suspend" | "unsuspend";
}

export default function SuspendUserModal({
  opened,
  onClose,
  onSubmit,
  loading,
  type,
}: Readonly<SuspendUserModalProps>) {
  const __ = useTranslations("User.SuspendUserModal");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={type === "suspend" ? __("titleSuspend") : __("titleUnsuspend")}
      size="md"
    >
      <SuspendUserForm onSubmit={onSubmit} loading={loading} />
    </Modal>
  );
}
