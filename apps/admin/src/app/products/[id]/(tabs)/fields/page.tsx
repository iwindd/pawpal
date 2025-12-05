"use client";
import ProductFieldDatatable from "@/components/Datatables/Product/Fields";
import FieldForm from "@/components/Forms/ProductForm/FieldForm";
import { useCreateProductFieldMutation } from "@/services/field";
import { IconPlus } from "@pawpal/icons";
import { FieldInput } from "@pawpal/shared";
import { Button, Modal, Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const FieldPage = () => {
  const product = useProduct();
  const __ = useTranslations("ProductField");
  const [modalOpened, { close, open }] = useDisclosure(false);

  const [createProductFieldMutation, { isLoading, error }] =
    useCreateProductFieldMutation();
  const onSubmit = async (values: FieldInput) => {
    const response = await createProductFieldMutation({
      productId: product.id,
      payload: values,
    });

    if (response.error) return;

    notify.show({
      title: __("notify.created.title"),
      message: __("notify.created.message"),
      color: "green",
    });
    close();
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
          isLoading={isLoading}
          errorMessage={error && "try_again"}
        />
      </Modal>
    </Paper>
  );
};

export default FieldPage;
