import { useUpdateProductStockMutation } from "@/features/productApi/productApi";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy } from "@pawpal/icons";
import { ProductStockInput, productStockSchema } from "@pawpal/shared";
import { Box, Button, Card, Group, NumberInput, Switch } from "@pawpal/ui/core";
import { useConfirmation } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useProduct } from "../../ProductContext";

export default function ProductStockForm({
  data,
}: {
  data: ProductStockInput;
}) {
  const { product, updateProduct: setProductContext } = useProduct();
  const __ = useTranslations("Product.stock");
  const _actions = useTranslations("Product.form.actions");

  const [updateProductStock, { isLoading }] = useUpdateProductStockMutation();
  const { confirmWithNote } = useConfirmation();

  const form = useFormValidate<ProductStockInput>({
    schema: productStockSchema,
    initialValues: {
      isStockTracked: data.isStockTracked ?? false,
      stock: data.stock || 0,
      stockNote: undefined,
    },
  });

  const handleSave = async (values: typeof form.values) => {
    const { confirmed, note } = await confirmWithNote({
      title: __("confirmTitle"),
      message: __("confirmMessage"),
      variant: "withNote",
    });

    if (!confirmed) return;

    const payload: ProductStockInput = {
      ...values,
      stockNote: note,
    };

    const response = await updateProductStock({
      id: product.id,
      stockData: payload,
    });

    if (response.error || !response.data) return;

    setProductContext({ ...product, ...response.data });
    form.resetDirty();

    notify.show({
      message: __("notify.message"),
      color: "green",
    });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSave)}>
      <Card withBorder shadow="sm" radius="md" p="md">
        <Card.Header title={__("title")} />
        <Card.Content>
          <Switch
            mt="md"
            label={__("limitStockLabel")}
            description={__("limitStockDescription")}
            {...form.getInputProps("isStockTracked", { type: "checkbox" })}
          />

          {form.values.isStockTracked && (
            <Box maw={"500px"}>
              <NumberInput
                mt="md"
                label={__("amountLabel")}
                min={0}
                {...form.getInputProps("stock")}
              />
            </Box>
          )}

          <Group mt="xl" justify="flex-start">
            {form.isDirty() && (
              <Button
                loading={isLoading}
                type="submit"
                color="success"
                leftSection={<IconDeviceFloppy size={14} />}
              >
                {_actions("save")}
              </Button>
            )}
          </Group>
        </Card.Content>
      </Card>
    </Box>
  );
}
