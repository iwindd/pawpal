import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy, IconPlus } from "@pawpal/icons";
import {
  ENUM_HOME_LAYOUT_STATUS,
  ENUM_HOME_SECTION_LOADER_TYPE,
  ENUM_HOME_SECTION_TYPE,
  HomeLayoutInput,
  HomeLayoutSectionItem,
  homeLayoutSchema,
} from "@pawpal/shared";
import {
  Box,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  TextInput,
} from "@pawpal/ui/core";
import { DragDropContext, Droppable } from "@pawpal/ui/draggable";
import { randomId } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import HomeLayoutStatusSelect from "../../Select/HomeLayoutStatus";
import SectionItem from "./components/SectionItem";

interface HomeLayoutFormProps {
  initialValues?: Partial<HomeLayoutInput>;
  onSubmit: (values: HomeLayoutInput) => Promise<void>;
  isLoading?: boolean;
  readonly?: boolean;
}

const HomeLayoutForm = ({
  initialValues,
  onSubmit,
  isLoading,
  readonly,
}: HomeLayoutFormProps) => {
  const t = useTranslations("HomeLayout.form");

  const form = useFormValidate<HomeLayoutInput>({
    schema: homeLayoutSchema,
    initialValues: {
      name: initialValues?.name || "",
      status: initialValues?.status || ENUM_HOME_LAYOUT_STATUS.DRAFT,
      sections: initialValues?.sections || [],
    },
  });

  const handleDragEnd = ({
    source,
    destination,
  }: {
    source: any;
    destination: any;
  }) => {
    if (!destination) return;
    form.reorderListItem("sections", {
      from: source.index,
      to: destination.index,
    });
  };

  const addSliderSection = () => {
    form.insertListItem("sections", {
      id: randomId(),
      title: "",
      type: ENUM_HOME_SECTION_TYPE.ITEM_SLIDER,
      config: {
        loader: {
          type: ENUM_HOME_SECTION_LOADER_TYPE.system,
          name: "",
        },
      },
    });
  };

  const addGroupSection = () => {
    form.insertListItem("sections", {
      id: randomId(),
      title: "",
      type: ENUM_HOME_SECTION_TYPE.ITEM_GROUP,
      config: {
        items: Array.from({ length: 4 }).map(() => ({
          id: randomId(),
          title: "",
          subtitle: "",
          href: "",
          image: "",
        })),
      },
    });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            {!readonly && (
              <Card>
                <Card.Header
                  title={t("sections-title")}
                  action={
                    <Group>
                      <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={addSliderSection}
                      >
                        {t("add-slider")}
                      </Button>
                      <Button
                        variant="light"
                        color="teal"
                        leftSection={<IconPlus size={16} />}
                        onClick={addGroupSection}
                      >
                        {t("add-group")}
                      </Button>
                    </Group>
                  }
                />
              </Card>
            )}
            <Box>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable
                  droppableId="home-layout-sections"
                  direction="vertical"
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {form.values.sections.map(
                        (item: HomeLayoutSectionItem, index: number) => (
                          <SectionItem
                            key={item.id}
                            item={item}
                            index={index}
                            form={form}
                          />
                        ),
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card>
            <Card.Header title={t("basic-info-title")} />
            <Card.Content>
              <Stack>
                <TextInput
                  withAsterisk
                  label={t("name")}
                  placeholder={t("name-placeholder")}
                  {...form.getInputProps("name")}
                />
                <HomeLayoutStatusSelect
                  withAsterisk
                  {...form.getInputProps("status")}
                />
                <Button
                  type="submit"
                  loading={isLoading}
                  color="success"
                  disabled={!form.isDirty() || isLoading}
                  leftSection={<IconDeviceFloppy size={14} />}
                  mt={"md"}
                >
                  {t("save-btn")}
                </Button>
              </Stack>
            </Card.Content>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default HomeLayoutForm;
