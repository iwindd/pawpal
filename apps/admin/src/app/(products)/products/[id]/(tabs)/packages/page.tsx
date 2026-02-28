"use client";
import PackageListForm from "@/components/Forms/PackageListForm";
import {
  useGetProductPackagesQuery,
  useUpdateProductPackagesBulkMutation,
} from "@/features/package/packageApi";
import { PackageBulkInput } from "@pawpal/shared";
import { Box, Card, Grid, Skeleton, Stack } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const PackagePage = () => {
  const { product } = useProduct();
  const __ = useTranslations("ProductPackage");

  // We fetch packages here. Default pagination limits may apply but assuming no more than a few packages per product.
  const { data, isLoading: isFetching } = useGetProductPackagesQuery({
    productId: product.id,
    params: {
      page: 1,
      limit: 100,
      sort: JSON.stringify({
        columnAccessor: "order",
        direction: "asc",
      }),
    },
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
      <Box mb="md">
        <Stack pb={80}>
          <Skeleton height={24} width={100} mb="md" />
          <Stack gap="md">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Card.Header title={<Skeleton height={20} width={100} />} />
                <Card.Content>
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Skeleton height={36} radius="sm" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Skeleton height={36} radius="sm" />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                      <Skeleton height={36} radius="sm" />
                    </Grid.Col>
                  </Grid>
                </Card.Content>
              </Card>
            ))}
          </Stack>
        </Stack>
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
