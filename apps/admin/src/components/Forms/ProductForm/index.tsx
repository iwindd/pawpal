"use client";
import CategoryCombobox from "@/components/Combobox/Category";
import ResourceInput from "@/components/Inputs/ResourceInput";
import useFormValidate from "@/hooks/useFormValidate";
import {
  AdminProductResponse,
  ProductInput,
  productSchema,
  slugify,
} from "@pawpal/shared";
import {
  Button,
  ErrorMessage,
  Group,
  Paper,
  Stack,
  Textarea,
  TextInput,
} from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";
import classes from "./style.module.css";

export type ProductFormControl = UseFormReturnType<ProductInput>;

interface ProductFormProps {
  product?: AdminProductResponse;
  onSubmit: (values: ProductInput, form: ProductFormControl) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
}

const ProductForm = ({
  product,
  onSubmit,
  isLoading,
  errorMessage,
  disabled,
}: ProductFormProps) => {
  const __ = useTranslations("Product.form");

  const form = useFormValidate<ProductInput>({
    schema: productSchema,
    group: "product",
    mode: "uncontrolled",
    enhanceGetInputProps: () => ({ disabled: disabled || isLoading }),
    initialValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      category_id: product?.categories?.[0]?.id || "",
      image_id: product?.image?.id || "",
    },
    onValuesChange: (current, prev) => {
      if (current.name !== prev.name) {
        form.setFieldValue("slug", slugify(current.name));
      }
    },
  });

  const handleSubmit = (values: ProductInput) => {
    onSubmit(values, form);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack maw="1920">
        {/* Product Information */}
        <Paper p="lg" title={__("sections.information")}>
          <Group gap={"xs"} className={classes.productInfo} align="flex-start">
            <Stack>
              <ResourceInput
                w={150}
                h={150}
                defaultValue={product?.image?.id}
                key={form.key("image_id")}
                {...form.getInputProps("image_id")}
              />
            </Stack>
            <Stack flex={1} gap={0} className={classes.productInfoContent}>
              <Stack mih={150} gap={"xs"} mb="xs">
                <TextInput
                  placeholder={__("fields.product.name.placeholder")}
                  withAsterisk
                  size="md"
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                />
                <Textarea
                  placeholder={__("fields.product.description.placeholder")}
                  maxRows={3}
                  size="xs"
                  flex={1}
                  styles={{
                    root: {
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    },
                    wrapper: {
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    },
                    input: { flex: 1, resize: "none" },
                  }}
                  classNames={{
                    input: classes.descriptionInput,
                  }}
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                />
              </Stack>
              <Group gap="xs" className={classes.productInfoMeta}>
                <TextInput
                  placeholder={__("fields.product.slug.placeholder")}
                  withAsterisk
                  size="xs"
                  key={form.key("slug")}
                  {...form.getInputProps("slug")}
                />
                <CategoryCombobox
                  inputProps={{
                    placeholder: __("fields.product.category.placeholder"),
                    withAsterisk: true,
                    size: "xs",
                  }}
                  key={form.key("category_id")}
                  {...form.getInputProps("category_id")}
                />
              </Group>
            </Stack>
          </Group>
        </Paper>

        {/* Form Actions */}
        <Stack gap="xs" align="end">
          <Group component={Group} gap="md" p={0} justify="flex-end">
            {form.isDirty() && (
              <Button
                type="submit"
                color="save"
                disabled={disabled}
                loading={isLoading}
              >
                {__("actions.save")}
              </Button>
            )}
          </Group>
          <Group>
            <ErrorMessage message={errorMessage} formatGroup="Errors.product" />
          </Group>
        </Stack>
      </Stack>
    </form>
  );
};

export default ProductForm;
