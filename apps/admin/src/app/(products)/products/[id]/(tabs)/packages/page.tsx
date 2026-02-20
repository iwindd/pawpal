"use client";
import PackageListForm from "@/components/Forms/PackageListForm";
import {
  useGetProductPackagesQuery,
  useUpdateProductPackagesBulkMutation,
} from "@/features/package/packageApi";
import { PackageBulkInput } from "@pawpal/shared";
import { Box, Text } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const PackagePage = () => {
  const { product } = useProduct();
  const __ = useTranslations("ProductPackage");

  // We fetch packages here. Default pagination limits may apply but assuming no more than a few packages per product.
  const { data, isLoading: isFetching } = useGetProductPackagesQuery({
    productId: product.id,
    params: { page: 1, limit: 100 },
  });

  const [updatePackagesBulk, { isLoading: isUpdating }] =
    useUpdateProductPackagesBulkMutation();

  const onSubmit = async (data: PackageBulkInput) => {
    const response = await updatePackagesBulk({
      productId: product.id,
      payload: data,
    });

    if (response.error) return;

    notify.show({
      message: __("notify.updated.message", {
        defaultValue: "Packages updated successfully.",
      }),
      color: "green",
    });
  };

  if (isFetching) {
    return (
      <Box p="xl" ta="center">
        <Text c="dimmed">
          {__("loading", { defaultValue: "Loading packages..." })}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <PackageListForm
        packages={data?.data || []}
        onSubmit={onSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
};

export default PackagePage;
