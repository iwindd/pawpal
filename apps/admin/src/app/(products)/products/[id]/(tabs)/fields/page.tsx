"use client";
import FieldListForm from "@/components/Forms/FieldListForm";
import {
  useGetProductFieldsQuery,
  useUpdateProductFieldsBulkMutation,
} from "@/features/field/fieldApi";
import { FieldBulkInput } from "@pawpal/shared";
import { Box, Text } from "@pawpal/ui/core";
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
      <Box p="xl" ta="center">
        <Text c="dimmed">
          {__("loading", { defaultValue: "Loading fields..." })}
        </Text>
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
