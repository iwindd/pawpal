import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy, IconPlus } from "@pawpal/icons";
import { TagInput, TagSchema } from "@pawpal/shared";
import { Box, Button, Group, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

interface TagFormProps {
  initialValues?: Partial<TagInput>;
  onSubmit: (values: TagInput) => void;
  form: ReturnType<typeof CreateTagForm>;
  variant?: "default" | "modal";
  type?: "save" | "create";
}

export const CreateTagForm = (props: {
  initialValues?: Partial<TagInput>;
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
    schema: TagSchema,
  });

  return {
    ...form,
    isLoading: props.isLoading,
  };
};

const TagForm = ({
  onSubmit,
  form,
  variant = "default",
  type = "save",
}: TagFormProps) => {
  const __ = useTranslations("Tag");

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

export default TagForm;
