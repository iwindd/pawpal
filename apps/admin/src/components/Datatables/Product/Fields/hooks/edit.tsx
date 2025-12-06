"use client";
import FieldForm from "@/components/Forms/ProductForm/FieldForm";
import { useUpdateFieldMutation } from "@/features/field/fieldApi";
import { AdminFieldResponse, FieldInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface EditFieldModalProps {
  field?: AdminFieldResponse;
  opened: boolean;
  onClose: () => void;
}

const EditFieldModal = ({ field, opened, onClose }: EditFieldModalProps) => {
  const __ = useTranslations("ProductField");
  const [updateFieldMutation, { isLoading, error }] = useUpdateFieldMutation();

  const handleSubmit = async (data: FieldInput) => {
    if (!field) return;
    const response = await updateFieldMutation({
      fieldId: field?.id,
      payload: data,
    });

    if (response.error) return;

    notify.show({
      title: __("notify.updated.title"),
      message: __("notify.updated.message"),
      color: "green",
    });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={__("actions.editField")}>
      <FieldForm
        field={field}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={error && "try_again"}
      />
    </Modal>
  );
};

const useEditFieldModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [field, setField] = useState<AdminFieldResponse | undefined>(undefined);

  const handleOpen = (field: AdminFieldResponse) => {
    setField(field);
    open();
  };

  return {
    open: handleOpen,
    close,
    modal: <EditFieldModal field={field} opened={opened} onClose={close} />,
  };
};

export default useEditFieldModal;
