"use client";
import CategoryCombobox from "@/components/Combobox/Category";
import ResourceInput from "@/components/Inputs/ResourceInput";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy } from "@pawpal/icons";
import {
  AdminProductResponse,
  ProductInput,
  productSchema,
  slugify,
} from "@pawpal/shared";
import {
  Box,
  Button,
  Card,
  ErrorMessage,
  Grid,
  Group,
  Stack,
  Textarea,
  TextInput,
  Transition,
} from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

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
      <Stack maw="1920" mb={80}>
        <Grid>
          {/* Left Column - General Information */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card>
              <Card.Header title={__("sections.general")} />
              <Card.Section inheritPadding pb="md">
                <Stack gap="md">
                  <TextInput
                    label={__("fields.product.name.label")}
                    placeholder={__("fields.product.name.placeholder")}
                    withAsterisk
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                  />

                  <Textarea
                    label={__("fields.product.description.label")}
                    placeholder={__("fields.product.description.placeholder")}
                    minRows={6}
                    autosize
                    key={form.key("description")}
                    {...form.getInputProps("description")}
                  />
                </Stack>
              </Card.Section>
            </Card>
          </Grid.Col>

          {/* Right Column - Media & Organization */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Card>
                <Card.Header title={__("sections.media")} />
                <Card.Content>
                  <Box
                    w="100%"
                    mx="auto"
                    style={{
                      aspectRatio: "500 / 550",
                      position: "relative",
                    }}
                  >
                    <Box w="100%" h="100%" pos="absolute">
                      <ResourceInput
                        w="100%"
                        h="100%"
                        defaultValue={product?.image?.id}
                        key={form.key("image_id")}
                        {...form.getInputProps("image_id")}
                      />
                    </Box>
                  </Box>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header title={__("sections.organization")} />
                <Card.Content>
                  <Stack>
                    <CategoryCombobox
                      inputProps={{
                        label: __("fields.product.category.label"),
                        placeholder: __("fields.product.category.placeholder"),
                        withAsterisk: true,
                      }}
                      key={form.key("category_id")}
                      {...form.getInputProps("category_id")}
                    />

                    <TextInput
                      label={__("fields.product.slug.label")}
                      placeholder={__("fields.product.slug.placeholder")}
                      withAsterisk
                      key={form.key("slug")}
                      {...form.getInputProps("slug")}
                    />
                  </Stack>
                </Card.Content>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Form Actions */}
        <Transition
          mounted={form.isDirty() || !!errorMessage}
          transition="slide-up"
          duration={200}
          timingFunction="ease"
        >
          {(styles: React.CSSProperties) => (
            <Box
              pos="fixed"
              bottom={0}
              right={0}
              left={0}
              p="md"
              bg="var(--mantine-color-body)"
              style={{
                ...styles,
                zIndex: 100,
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Group
                component={Group}
                gap="md"
                p={0}
                justify="flex-end"
                w="100%"
                maw={1920}
                mx="auto"
              >
                <Button
                  type="submit"
                  color="success"
                  loading={isLoading}
                  disabled={disabled || !form.isDirty()}
                  leftSection={<IconDeviceFloppy size={14} />}
                >
                  {__("actions.save")}
                </Button>
                <ErrorMessage
                  message={errorMessage}
                  formatGroup="Errors.product"
                />
              </Group>
            </Box>
          )}
        </Transition>
      </Stack>
    </form>
  );
};

export default ProductForm;
