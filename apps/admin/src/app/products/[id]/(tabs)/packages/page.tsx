"use client";
import ProductPackageDatatable from "@/components/Datatables/Product/Package";
import PackageModal from "@/components/Modals/Package";
import API from "@/libs/api/client";
import { IconPlus } from "@pawpal/icons";
import { PackageInput } from "@pawpal/shared";
import { Button, Paper } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const PackagePage = () => {
  const product = useProduct();
  const __ = useTranslations("ProductPackage");
  const [modalOpened, { close, open }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PackageInput) =>
      await API.package.create(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages", product.id] });
      notify.show({
        title: __("notify.created.title"),
        message: __("notify.created.message"),
        color: "green",
      });
      close();
    },
  });

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
        onSubmit={mutate}
        opened={modalOpened}
        onClose={close}
        isLoading={isPending}
        title={__("actions.addPackage")}
      />
    </Paper>
  );
};

export default PackagePage;
