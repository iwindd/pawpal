"use client";
import PackageModal from "@/components/Modals/Package";
import { useUpdatePackageMutation } from "@/features/package/packageApi";
import { AdminProductPackageResponse, PackageInput } from "@pawpal/shared";
import { useDisclosure } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
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
  const [updatePackageMutation, { isLoading }] = useUpdatePackageMutation();

  const handleSubmit = async (data: PackageInput) => {
    const response = await updatePackageMutation({
      packageId: pkg!.id,
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
    <PackageModal
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isLoading}
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
