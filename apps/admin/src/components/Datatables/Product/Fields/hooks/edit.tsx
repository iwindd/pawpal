"use client";
import FieldForm from "@/components/Forms/ProductForm/FieldForm";
import API from "@/libs/api/client";
import { AdminFieldResponse, FieldInput } from "@pawpal/shared";
import { Modal } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface EditFieldModalProps {
  field?: AdminFieldResponse;
  opened: boolean;
  onClose: () => void;
}

const EditFieldModal = ({ field, opened, onClose }: EditFieldModalProps) => {
  const __ = useTranslations("ProductField");
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FieldInput) => {
      if (!field) throw new Error("Field is required");

      return await API.field.update(field.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields"] });
      notify.show({
        title: __("notify.updated.title"),
        message: __("notify.updated.message"),
        color: "green",
      });
      onClose();
    },
    onError: () => {
      setErrorMessage("try_again");
    },
  });

  const handleSubmit = (data: FieldInput) => {
    mutate(data);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={__("actions.editField")}>
      <FieldForm
        field={field}
        onSubmit={handleSubmit}
        isLoading={isPending}
        errorMessage={errorMessage}
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
