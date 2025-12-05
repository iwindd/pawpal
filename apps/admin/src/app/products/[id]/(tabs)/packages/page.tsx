"use client";
import ProductPackageDatatable from "@/components/Datatables/Product/Package";
import PackageModal from "@/components/Modals/Package";
import { useCreateProductPackageMutation } from "@/services/package";
import { IconPlus } from "@pawpal/icons";
import { PackageInput } from "@pawpal/shared";
import { Button, Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const PackagePage = () => {
  const product = useProduct();
  const __ = useTranslations("ProductPackage");
  const [modalOpened, { close, open }] = useDisclosure(false);
  const [createProductPackage, { isLoading }] =
    useCreateProductPackageMutation();

  const onSubmit = async (data: PackageInput) => {
    const response = await createProductPackage({
      productId: product.id,
      payload: data,
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
          {__("actions.addPackage")}
        </Button>
      }
    >
      <ProductPackageDatatable productId={product.id} />
      <PackageModal
        onSubmit={onSubmit}
        opened={modalOpened}
        onClose={close}
        isLoading={isLoading}
        title={__("actions.addPackage")}
      />
    </Paper>
  );
};

export default PackagePage;
