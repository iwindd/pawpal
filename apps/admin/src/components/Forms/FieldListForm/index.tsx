"use client";
import FieldTypeSelect from "@/components/Select/FieldType";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy, IconDrag, IconPlus, IconTrash } from "@pawpal/icons";
import {
  AdminFieldResponse,
  ENUM_FIELD_TYPE,
  FieldBulkInput,
  fieldBulkSchema,
} from "@pawpal/shared";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Transition,
  UnstyledButton,
} from "@pawpal/ui/core";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@pawpal/ui/draggable";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

export type FieldListFormControl = UseFormReturnType<FieldBulkInput>;

export interface FieldListFormProps {
  fields: AdminFieldResponse[];
  onSubmit: (data: FieldBulkInput, form: FieldListFormControl) => void;
  isLoading?: boolean;
}

const FieldListForm = ({ fields, onSubmit, isLoading }: FieldListFormProps) => {
  const __ = useTranslations("Field.form");
  const __product = useTranslations("Product.form");

  const form = useFormValidate<FieldBulkInput>({
    schema: fieldBulkSchema,
    group: "field",
    enhanceGetInputProps: () => ({ disabled: isLoading }),
    initialValues: {
      fields: fields.map((f) => ({
        id: f.id,
        label: f.label,
        placeholder: f.placeholder || "",
        type: f.type,
        optional: f.optional || false,
        metadata: {
          options: (f.metadata as any)?.options || [""],
        },
      })),
    },
  });

  const handleSubmit = (data: FieldBulkInput) => {
    onSubmit(data, form);
  };

  const handleAddField = () => {
    form.insertListItem("fields", {
      label: "",
      placeholder: "",
      type: ENUM_FIELD_TYPE.TEXT,
      optional: false,
      metadata: { options: [""] },
    });
  };

  const handleRemoveField = (index: number) => {
    form.removeListItem("fields", index);
  };

  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    form.reorderListItem("fields", {
      from: source.index,
      to: destination.index,
    });
  };

  const handleAddOption = (fieldIndex: number) => {
    const currentOptions =
      (form.getValues().fields[fieldIndex] as any).metadata?.options || [];
    form.setFieldValue(`fields.${fieldIndex}.metadata.options`, [
      ...currentOptions,
      "",
    ]);
  };

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions =
      (form.getValues().fields[fieldIndex] as any).metadata?.options || [];
    form.setFieldValue(
      `fields.${fieldIndex}.metadata.options`,
      currentOptions.filter((_: string, i: number) => i !== optionIndex),
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack pb={80}>
        <Group justify="space-between" align="center" mb="md">
          <Text size="lg" fw={600}>
            {__("title", { defaultValue: "Fields" })}
          </Text>
        </Group>

        <Stack gap="md">
          {form.getValues().fields.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              {__("empty", { defaultValue: "No fields added yet." })}
            </Text>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields-droppable">
              {(provided) => (
                <Stack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  gap="md"
                >
                  {form.getValues().fields.map((fieldItem, index) => (
                    <Draggable
                      key={form.key(`fields.${index}`)}
                      draggableId={form.key(`fields.${index}`)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            boxShadow: snapshot.isDragging
                              ? "var(--mantine-shadow-md)"
                              : undefined,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Card.Header
                            title={
                              <Group wrap="nowrap" gap="xs">
                                <div
                                  {...provided.dragHandleProps}
                                  style={{
                                    cursor: "grab",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <IconDrag
                                    size={18}
                                    color="var(--mantine-color-dimmed)"
                                  />
                                </div>
                                <span>{`${__("field", { defaultValue: "Field" })} ${index + 1}`}</span>
                              </Group>
                            }
                            action={
                              <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={() => handleRemoveField(index)}
                                disabled={isLoading}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            }
                          />
                          <Card.Content>
                            <Grid>
                              <Grid.Col span={{ base: 12, md: 4 }}>
                                <TextInput
                                  label={__("fields.label.label")}
                                  placeholder={__("fields.label.placeholder")}
                                  withAsterisk
                                  {...form.getInputProps(
                                    `fields.${index}.label`,
                                  )}
                                />
                              </Grid.Col>
                              <Grid.Col span={{ base: 12, md: 4 }}>
                                <TextInput
                                  label={__("fields.placeholder.label")}
                                  placeholder={__(
                                    "fields.placeholder.placeholder",
                                  )}
                                  {...form.getInputProps(
                                    `fields.${index}.placeholder`,
                                  )}
                                />
                              </Grid.Col>
                              <Grid.Col span={{ base: 12, md: 4 }}>
                                <FieldTypeSelect
                                  label={__("fields.type.label", {
                                    defaultValue: "Field Type",
                                  })}
                                  withAsterisk
                                  {...form.getInputProps(
                                    `fields.${index}.type`,
                                  )}
                                />
                              </Grid.Col>

                              {fieldItem.type === ENUM_FIELD_TYPE.SELECT && (
                                <Grid.Col span={12}>
                                  <Card withBorder radius="md">
                                    <Table>
                                      <Table.Tbody>
                                        {(
                                          (fieldItem as any).metadata
                                            ?.options || []
                                        ).map((_: any, optionIndex: number) => (
                                          <Table.Tr
                                            key={form.key(
                                              `fields.${index}.metadata.options.${optionIndex}`,
                                            )}
                                          >
                                            <Table.Td pl={0}>
                                              <TextInput
                                                size="xs"
                                                placeholder={__(
                                                  "fields.option.placeholder",
                                                  {
                                                    index: optionIndex + 1,
                                                  },
                                                )}
                                                {...form.getInputProps(
                                                  `fields.${index}.metadata.options.${optionIndex}`,
                                                )}
                                              />
                                            </Table.Td>
                                            <Table.Td w="0" px={0}>
                                              <ActionIcon
                                                variant="light"
                                                color="danger"
                                                size="md"
                                                disabled={
                                                  (
                                                    (fieldItem as any).metadata
                                                      ?.options || []
                                                  ).length <= 1
                                                }
                                                onClick={() =>
                                                  handleRemoveOption(
                                                    index,
                                                    optionIndex,
                                                  )
                                                }
                                              >
                                                <IconTrash size={20} />
                                              </ActionIcon>
                                            </Table.Td>
                                          </Table.Tr>
                                        ))}
                                      </Table.Tbody>
                                    </Table>
                                    <Group justify="end" mt="md">
                                      <Button
                                        size="xs"
                                        variant="light"
                                        type="button"
                                        onClick={() => handleAddOption(index)}
                                      >
                                        {__("fields.option.addButton")}
                                      </Button>
                                    </Group>
                                  </Card>
                                </Grid.Col>
                              )}

                              <Grid.Col span={12}>
                                <Checkbox
                                  label={__("fields.isOptional.label")}
                                  {...form.getInputProps(
                                    `fields.${index}.optional`,
                                    { type: "checkbox" },
                                  )}
                                />
                              </Grid.Col>
                            </Grid>
                          </Card.Content>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>

          <Grid>
            <Grid.Col span={12}>
              <UnstyledButton
                w="100%"
                h="100%"
                mih={150}
                onClick={handleAddField}
                disabled={isLoading}
                style={{
                  border: "2px dashed var(--mantine-color-default-border)",
                  borderRadius: "var(--mantine-radius-md)",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <Stack align="center" gap="xs">
                  <ActionIcon
                    size="xl"
                    radius="xl"
                    variant="light"
                    color="secondary"
                    style={{ pointerEvents: "none" }}
                    component="a"
                  >
                    <IconPlus size={24} />
                  </ActionIcon>
                  <Text fw={500} c="secondary">
                    {__("actions.addField", { defaultValue: "Add Field" })}
                  </Text>
                </Stack>
              </UnstyledButton>
            </Grid.Col>
          </Grid>
        </Stack>
      </Stack>

      {/* Sticky Action Bar */}
      <Transition
        mounted={form.isDirty()}
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
                disabled={!form.isDirty() || isLoading}
                leftSection={<IconDeviceFloppy size={14} />}
              >
                {__product("actions.save", { defaultValue: "Save changes" })}
              </Button>
            </Group>
          </Box>
        )}
      </Transition>
    </form>
  );
};

export default FieldListForm;
