import useFormValidate from "@/hooks/useFormValidate";
import { PackageInput, packageSchema } from "@pawpal/shared";
import { Button, Group, NumberInput, Stack, TextInput } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export interface PackageFormProps {
  onSubmit: (data: PackageInput) => void;
  actionSection?: React.ReactNode;
  isLoading?: boolean;
}

const PackageForm = (props: PackageFormProps) => {
  const __ = useTranslations("ProductPackage.form");

  const form = useFormValidate<PackageInput>({
    schema: packageSchema,
    group: "package",
    mode: "uncontrolled",
    enhanceGetInputProps: () => ({ disabled: props.isLoading }),
    initialValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  const handleSubmit = (data: PackageInput) => {
    props.onSubmit(data);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xs">
        <TextInput
          label={__("fields.name.label")}
          placeholder={__("fields.name.placeholder")}
          withAsterisk
          key={form.key(`name`)}
          {...form.getInputProps(`name`)}
        />

        <NumberInput
          label={__("fields.price.label")}
          placeholder={__("fields.price.placeholder")}
          withAsterisk
          min={0}
          decimalScale={2}
          fixedDecimalScale
          prefix="$"
          key={form.key(`price`)}
          {...form.getInputProps(`price`)}
        />

        <TextInput
          label={__("fields.description.label")}
          placeholder={__("fields.description.placeholder")}
          key={form.key(`description`)}
          {...form.getInputProps(`description`)}
        />

        <Group justify="end">
          {props.actionSection}
          <Button type="submit" loading={props.isLoading}>
            {__("actions.save")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default PackageForm;
