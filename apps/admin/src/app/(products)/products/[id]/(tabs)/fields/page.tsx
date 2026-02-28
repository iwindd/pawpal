"use client";
import FieldListForm from "@/components/Forms/FieldListForm";
import {
  useGetProductFieldsQuery,
  useUpdateProductFieldsBulkMutation,
} from "@/features/field/fieldApi";
import { FieldBulkInput } from "@pawpal/shared";
import { Box, Card, Grid, Skeleton, Stack } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

const FieldPage = () => {
  const { product } = useProduct();
  const __ = useTranslations("ProductField");

  const { data, isLoading: isFetching } = useGetProductFieldsQuery({
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

  const [updateFieldsBulk, { isLoading: isUpdating }] =
    useUpdateProductFieldsBulkMutation();

  const onSubmit = async (payload: FieldBulkInput) => {
    const response = await updateFieldsBulk({
      productId: product.id,
      payload,
    });

    if (response.error) return;

    notify.show({
      message: __("notify.updated.message", {
        defaultValue: "Fields updated successfully.",
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
      <FieldListForm
        fields={data?.data || []}
        onSubmit={onSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
};

export default FieldPage;
