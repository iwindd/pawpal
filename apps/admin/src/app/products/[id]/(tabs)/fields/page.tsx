"use client";
import ProductFieldDatatable from "@/components/Datatables/Product/Fields";
import FieldForm from "@/components/Forms/ProductForm/FieldForm";
import API from "@/libs/api/client";
import { IconPlus } from "@pawpal/icons";
import { FieldInput } from "@pawpal/shared";
import { Button, Modal, Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProduct } from "../../ProductContext";

const FieldPage = () => {
  const product = useProduct();
  const __ = useTranslations("ProductField");
  const [modalOpened, { close, open }] = useDisclosure(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FieldInput) =>
      API.field.createProductField(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", product.id] });
      notify.show({
        title: __("notify.created.title"),
        message: __("notify.created.message"),
        color: "green",
      });
      close();
    },
    onError: () => {
      setErrorMessage("try_again");
    },
  });

  const onSubmit = (values: FieldInput) => {
    mutate(values);
  };

  return (
    <Paper
      p="lg"
      title={__("title")}
      rightSection={
        <Button
          size="xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={open}
        >
          {__("actions.addField")}
        </Button>
      }
    >
      <ProductFieldDatatable productId={product.id} />
      <Modal
        size="md"
        title={__("actions.addField")}
        opened={modalOpened}
        onClose={close}
      >
        <FieldForm
          onSubmit={onSubmit}
          isLoading={isPending}
          errorMessage={errorMessage}
        />
      </Modal>
    </Paper>
  );
};

export default FieldPage;
