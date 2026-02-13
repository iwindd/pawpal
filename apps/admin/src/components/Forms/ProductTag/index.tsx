import useFormValidate from "@/hooks/useFormValidate";
import { ProductTagInput, ProductTagSchema } from "@pawpal/shared";
import { Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface ProductTagFormProps {
  initialValues?: Partial<ProductTagInput>;
  onSubmit: (values: ProductTagInput) => void;
  form: ReturnType<typeof CreateProductTagForm>;
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

const ProductTagForm = ({ onSubmit, form }: ProductTagFormProps) => {
  const __ = useTranslations("ProductTag");

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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
          description={__("form.slug.description")}
          required
          {...form.getInputProps("slug")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" color="save" loading={form.isLoading}>
            {__("form.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ProductTagForm;
