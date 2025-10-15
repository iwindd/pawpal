"use client";
import CategoryCombobox from "@/components/Combobox/Category";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDelete, IconPlus, IconPublishShare } from "@pawpal/icons";
import {
  AdminProductEditResponse,
  ProductInput,
  productSchema,
  slugify,
} from "@pawpal/shared";
import {
  ActionIcon,
  Button,
  ErrorMessage,
  Grid,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

export type ProductFormControl = UseFormReturnType<ProductInput>;

interface ProductFormProps {
  product?: AdminProductEditResponse;
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
      category_id: product?.category?.id || "",
      packages: product?.packages?.length
        ? product.packages.map((pkg) => ({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description || "",
          }))
        : [{ name: "", price: 0, description: "" }],
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

  const addPackage = () => {
    const currentPackages = form.getValues().packages;
    form.setFieldValue("packages", [
      ...currentPackages,
      { name: "", price: 0, description: "" },
    ]);
  };

  const removePackage = (index: number) => {
    const currentPackages = form.getValues().packages;
    if (currentPackages.length > 1) {
      form.setFieldValue(
        "packages",
        currentPackages.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack maw="1920">
        {/* Product Information */}
        <Paper p="md">
          <Stack gap="md">
            <Text size="lg" fw={600}>
              {__("sections.information")}
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label={__("fields.product.name.label")}
                  placeholder={__("fields.product.name.placeholder")}
                  withAsterisk
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label={__("fields.product.slug.label")}
                  placeholder={__("fields.product.slug.placeholder")}
                  withAsterisk
                  key={form.key("slug")}
                  {...form.getInputProps("slug")}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TextInput
                  label={__("fields.product.description.label")}
                  placeholder={__("fields.product.description.placeholder")}
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <CategoryCombobox
                  label={__("fields.product.category.label")}
                  placeholder={__("fields.product.category.placeholder")}
                  withAsterisk
                  key={form.key("category_id")}
                  {...form.getInputProps("category_id")}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* Packages */}
        <Paper p="md">
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Text size="lg" fw={600}>
                {__("sections.packages")}
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={addPackage}
                disabled={disabled || isLoading}
              >
                {__("actions.addPackage")}
              </Button>
            </Group>

            <Stack gap="md">
              {form.getValues().packages.map((_, index) => (
                <Paper key={index} p="sm" withBorder>
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Text size="sm" fw={500}>
                        {__("messages.package_count", { count: index + 1 })}
                      </Text>
                      {form.getValues().packages.length > 1 && (
                        <ActionIcon
                          size="sm"
                          color="red"
                          variant="light"
                          onClick={() => removePackage(index)}
                          disabled={disabled || isLoading}
                        >
                          <IconDelete size={14} />
                        </ActionIcon>
                      )}
                    </Group>

                    <Grid>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                          label={__("fields.package.name.label")}
                          placeholder={__("fields.package.name.placeholder")}
                          withAsterisk
                          key={form.key(`packages.${index}.name`)}
                          {...form.getInputProps(`packages.${index}.name`)}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <NumberInput
                          label={__("fields.package.price.label")}
                          placeholder={__("fields.package.price.placeholder")}
                          withAsterisk
                          min={0}
                          decimalScale={2}
                          fixedDecimalScale
                          prefix="$"
                          key={form.key(`packages.${index}.price`)}
                          {...form.getInputProps(`packages.${index}.price`)}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <TextInput
                          label={__("fields.package.description.label")}
                          placeholder={__(
                            "fields.package.description.placeholder"
                          )}
                          key={form.key(`packages.${index}.description`)}
                          {...form.getInputProps(
                            `packages.${index}.description`
                          )}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Paper>

        {/* Form Actions */}
        <Stack gap="xs" align="end" py="md">
          <Group component={Group} gap="md" p={0} justify="flex-end">
            <Button
              type="submit"
              color="save"
              disabled={disabled}
              rightSection={<IconPublishShare size={16} />}
              loading={isLoading}
            >
              {__("actions.save")}
            </Button>
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
