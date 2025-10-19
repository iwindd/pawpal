import FieldTypeSelect from "@/components/Select/FieldType";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDelete } from "@pawpal/icons";
import {
  AdminFieldResponse,
  ENUM_FIELD_TYPE,
  FieldInput,
  FieldSchema,
} from "@pawpal/shared";
import {
  ActionIcon,
  Button,
  Checkbox,
  ErrorMessage,
  Group,
  Paper,
  Stack,
  Table,
  TextInput,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";

export interface FieldFormProps {
  field?: AdminFieldResponse;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

const FieldForm = ({
  field,
  onSubmit,
  isLoading,
  errorMessage,
}: FieldFormProps) => {
  const __ = useTranslations("Field.form");

  const form = useFormValidate<FieldInput>({
    schema: FieldSchema,
    mode: "controlled",
    enhanceGetInputProps: () => ({ disabled: isLoading }),
    initialValues: {
      label: field?.label || "",
      placeholder: field?.placeholder || "",
      type: field?.type || ENUM_FIELD_TYPE.TEXT,
      optional: field?.optional || false,
      metadata: {
        options: field?.metadata?.options || [""],
      },
    },
  });

  const getCurrentOptions = (): string[] => {
    return (form.getValues() as any).metadata?.options || [];
  };

  const handleAddOption = () => {
    const currentOptions = getCurrentOptions();
    form.setFieldValue("metadata", {
      options: [...currentOptions, ""],
    });
  };

  const handleRemoveField = (index: number) => {
    const currentOptions = getCurrentOptions();
    form.setFieldValue("metadata", {
      options: currentOptions.filter((_, i) => i !== index),
    });
  };

  const currentOptions = getCurrentOptions();

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
          <FieldTypeSelect
            withAsterisk
            key={form.key("type")}
            {...form.getInputProps("type")}
          />

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

        <Stack align="end" mt="md" gap="xs">
          <div>
            <Button loading={isLoading} type="submit">
              {__("actions.save")}
            </Button>
          </div>
          <ErrorMessage message={errorMessage} formatGroup="Errors" />
        </Stack>
      </Stack>
    </form>
  );
};

export default FieldForm;
