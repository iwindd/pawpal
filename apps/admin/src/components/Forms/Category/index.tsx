import useFormValidate from "@/hooks/useFormValidate";
import { CategoryInput, categorySchema } from "@pawpal/shared";
import { Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface CategoryFormProps {
  initialValues?: Partial<CategoryInput>;
  onSubmit: (values: CategoryInput) => void;
  form: ReturnType<typeof CreateCategoryForm>;
}

export const CreateCategoryForm = (props: {
  initialValues?: Partial<CategoryInput>;
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
    schema: categorySchema,
  });

  return {
    ...form,
    isLoading: props.isLoading,
  };
};

const CategoryForm = ({ onSubmit, form }: CategoryFormProps) => {
  const __ = useTranslations("Product.category");

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
          <Button type="submit" color="success" loading={form.isLoading}>
            {__("form.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CategoryForm;
