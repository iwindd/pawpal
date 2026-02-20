"use client";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy, IconDrag, IconTrash } from "@pawpal/icons";
import {
  AdminProductPackageResponse,
  PackageBulkInput,
  packageBulkSchema,
} from "@pawpal/shared";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Transition,
} from "@pawpal/ui/core";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@pawpal/ui/draggable";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";
import AddPackageCardButton from "./AddPackageCardButton";

export type PackageListFormControl = UseFormReturnType<PackageBulkInput>;

export interface PackageListFormProps {
  packages: AdminProductPackageResponse[];
  onSubmit: (data: PackageBulkInput, form: PackageListFormControl) => void;
  isLoading?: boolean;
}

const PackageListForm = ({
  packages,
  onSubmit,
  isLoading,
}: PackageListFormProps) => {
  const __ = useTranslations("ProductPackage.form");
  const __product = useTranslations("Product.form");

  const form = useFormValidate<PackageBulkInput>({
    schema: packageBulkSchema,
    group: "package",
    enhanceGetInputProps: () => ({ disabled: isLoading }),
    initialValues: {
      packages: packages.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        description: p.description || "",
      })),
    },
  });

  const handleSubmit = (data: PackageBulkInput) => {
    onSubmit(data, form);
  };

  const handleAddPackage = () => {
    form.insertListItem("packages", {
      name: "",
      price: 0,
      description: "",
    });
  };

  const handleRemovePackage = (index: number) => {
    form.removeListItem("packages", index);
  };

  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    form.reorderListItem("packages", {
      from: source.index,
      to: destination.index,
    });
  };

  // When form resets, it might lose dirty state, but it will be handled by the parent caller if needed.
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack pb={80}>
        <Group justify="space-between" align="center" mb="md">
          <Text size="lg" fw={600}>
            {__("title", { defaultValue: "Packages" })}
          </Text>
        </Group>

        <Stack gap="md">
          {form.getValues().packages.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              {__("empty", { defaultValue: "No packages added yet." })}
            </Text>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="packages-droppable">
              {(provided) => (
                <Grid ref={provided.innerRef} {...provided.droppableProps}>
                  {form.getValues().packages.map((item, index) => (
                    <Draggable
                      key={form.key(`packages.${index}`)}
                      draggableId={form.key(`packages.${index}`)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Grid.Col
                          span={12}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <Card
                            style={{
                              boxShadow: snapshot.isDragging
                                ? "var(--mantine-shadow-md)"
                                : undefined,
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
                                  <span>{`${__("package", { defaultValue: "Package" })} ${index + 1}`}</span>
                                </Group>
                              }
                              action={
                                <ActionIcon
                                  color="red"
                                  variant="subtle"
                                  onClick={() => handleRemovePackage(index)}
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
                                    label={__("fields.name.label")}
                                    placeholder={__("fields.name.placeholder")}
                                    withAsterisk
                                    {...form.getInputProps(
                                      `packages.${index}.name`,
                                    )}
                                  />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                  <NumberInput
                                    label={__("fields.price.label")}
                                    placeholder={__("fields.price.placeholder")}
                                    withAsterisk
                                    min={0}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    prefix="$"
                                    {...form.getInputProps(
                                      `packages.${index}.price`,
                                    )}
                                  />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, md: 4 }}>
                                  <TextInput
                                    label={__("fields.description.label")}
                                    placeholder={__(
                                      "fields.description.placeholder",
                                    )}
                                    {...form.getInputProps(
                                      `packages.${index}.description`,
                                    )}
                                  />
                                </Grid.Col>
                              </Grid>
                            </Card.Content>
                          </Card>
                        </Grid.Col>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>

          <Grid>
            <Grid.Col span={12}>
              <AddPackageCardButton
                handleAddPackage={handleAddPackage}
                isLoading={isLoading}
                label={__("actions.add", { defaultValue: "Add Package" })}
              />
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

export default PackageListForm;
