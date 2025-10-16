import useFormValidate from "@/hooks/useFormValidate";
import { IconDelete } from "@pawpal/icons";
import { ENUM_FIELD_TYPE, FieldInput, FieldSchema } from "@pawpal/shared";
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  TextInput,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export interface FieldFormProps {
  onSubmit: (data: any) => void;
}

const FieldForm = ({ onSubmit }: FieldFormProps) => {
  const __ = useTranslations("Field.form");

  const form = useFormValidate<FieldInput>({
    schema: FieldSchema,
    mode: "controlled",
    initialValues: {
      label: "",
      placeholder: "",
      type: "text",
      optional: false,
      metadata: {
        options: [""],
      },
    },
  });

  const handleAddOption = () => {
    const metadata = form.getValues().metadata || { options: [] };
    const currentOptions = metadata.options || [];
    form.setFieldValue("metadata", {
      options: [...currentOptions, ""],
    });
  };

  const handleRemoveField = (index: number) => {
    const currentOptions = form.getValues().metadata?.options || [];
    form.setFieldValue("metadata", {
      options: currentOptions.filter((_, i) => i !== index),
    });
  };

  const currentOptions = form.getValues().metadata?.options || [];

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="xs">
        <TextInput
          label={__("fields.label.label")}
          placeholder={__("fields.label.placeholder")}
          withAsterisk
          key={form.key("label")}
          {...form.getInputProps("label")}
        />

        <TextInput
          label={__("fields.placeholder.label")}
          placeholder={__("fields.placeholder.placeholder")}
          withAsterisk
          key={form.key("placeholder")}
          {...form.getInputProps("placeholder")}
        />

        <Stack gap={0}>
          <Select
            label={__("fields.type.label")}
            placeholder={__("fields.type.placeholder")}
            defaultValue={ENUM_FIELD_TYPE.TEXT}
            withAsterisk
            data={[
              {
                value: ENUM_FIELD_TYPE.TEXT,
                label: __("fields.type.options.text"),
              },
              {
                value: ENUM_FIELD_TYPE.SELECT,
                label: __("fields.type.options.select"),
              },
              {
                value: ENUM_FIELD_TYPE.EMAIL,
                label: __("fields.type.options.email"),
              },
              {
                value: ENUM_FIELD_TYPE.PASSWORD,
                label: __("fields.type.options.password"),
              },
            ]}
            key={form.key("type")}
            {...form.getInputProps("type")}
          ></Select>

          {/* OPTIONS */}
          {form.getValues().type == ENUM_FIELD_TYPE.SELECT && (
            <Paper>
              <Table>
                <Table.Tbody>
                  {currentOptions.map((_, index) => (
                    <Table.Tr key={`option-${index.toString()}`}>
                      <Table.Td pl={0}>
                        <TextInput
                          size="xs"
                          placeholder={__("fields.option.placeholder", {
                            index: index + 1,
                          })}
                          key={form.key(`metadata.options.${index}`)}
                          {...form.getInputProps(`metadata.options.${index}`)}
                        />
                      </Table.Td>
                      <Table.Td w="0" px={0}>
                        <Stack>
                          <ActionIcon
                            variant="light"
                            color="danger"
                            size={"md"}
                            disabled={currentOptions.length <= 1}
                            onClick={() => handleRemoveField(index)}
                          >
                            <IconDelete size={20} />
                          </ActionIcon>
                        </Stack>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group justify="end">
                <Button
                  size="xs"
                  variant="light"
                  type="button"
                  onClick={handleAddOption}
                >
                  {__("fields.option.addButton")}
                </Button>
              </Group>
            </Paper>
          )}
        </Stack>

        <Checkbox label={__("fields.isOptional.label")}></Checkbox>

        <Group justify="end" mt="md">
          <Button type="submit">{__("actions.saveAndAdd")}</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default FieldForm;
