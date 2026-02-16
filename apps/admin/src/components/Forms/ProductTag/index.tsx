import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy, IconPlus } from "@pawpal/icons";
import { ProductTagInput, ProductTagSchema } from "@pawpal/shared";
import { Box, Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface ProductTagFormProps {
  initialValues?: Partial<ProductTagInput>;
  onSubmit: (values: ProductTagInput) => void;
  form: ReturnType<typeof CreateProductTagForm>;
  variant?: "default" | "modal";
  type?: "save" | "create";
}

export const CreateProductTagForm = (props: {
  initialValues?: Partial<ProductTagInput>;
  isLoading?: boolean;
}) => {
  const form = useFormValidate({
    initialValues: {
      name: props.initialValues?.name || "",
      slug: props.initialValues?.slug || "",
    },
    enhanceGetInputProps: () => ({
      disabled: props.isLoading,
    }),
    schema: ProductTagSchema,
  });

  return {
    ...form,
    isLoading: props.isLoading,
  };
};

const ProductTagForm = ({
  onSubmit,
  form,
  variant = "default",
  type = "save",
}: ProductTagFormProps) => {
  const __ = useTranslations("ProductTag");

  return (
    <Box component={"form"} onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label={__("form.name.label")}
          placeholder={__("form.name.placeholder")}
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          label={__("form.slug.label")}
          placeholder={__("form.slug.placeholder")}
          required
          {...form.getInputProps("slug")}
        />
      </Stack>

      <Group justify={variant == "modal" ? "flex-end" : "flex-start"} mt={"xl"}>
        {type === "create" ? (
          <Button
            type="submit"
            color="success"
            loading={form.isLoading}
            rightSection={<IconPlus size={14} />}
          >
            {__("form.create")}
          </Button>
        ) : (
          form.isDirty() && (
            <Button
              type="submit"
              color="success"
              loading={form.isLoading}
              leftSection={<IconDeviceFloppy size={14} />}
            >
              {__("form.save")}
            </Button>
          )
        )}
      </Group>
    </Box>
  );
};

export default ProductTagForm;
