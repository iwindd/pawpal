"use client";
import PackageModal from "@/components/Modals/Package";
import API from "@/libs/api/client";
import { AdminProductPackageResponse, PackageInput } from "@pawpal/shared";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface EditPackageModalProps {
  package?: AdminProductPackageResponse;
  opened: boolean;
  onClose: () => void;
}

const EditPackageModal = ({
  package: pkg,
  opened,
  onClose,
}: EditPackageModalProps) => {
  const __ = useTranslations("ProductPackage");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PackageInput) =>
      await API.package.update(pkg!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      notify.show({
        title: __("notify.updated.title"),
        message: __("notify.updated.message"),
        color: "green",
      });
      onClose();
    },
  });

  const handleSubmit = (data: PackageInput) => {
    mutate(data);
  };

  return (
    <PackageModal
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isPending}
      title={__("actions.editPackage")}
      opened={opened}
      package={pkg}
    />
  );
};

const useEditPackageModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [pkg, setPkg] = useState<AdminProductPackageResponse | undefined>(
    undefined
  );

  const handleOpen = (pkg: AdminProductPackageResponse) => {
    setPkg(pkg);
    open();
    console.log("Opening edit modal for package:", pkg);
  };

  return {
    open: handleOpen,
    close,
    modal: <EditPackageModal package={pkg} opened={opened} onClose={close} />,
  };
};

export default useEditPackageModal;
