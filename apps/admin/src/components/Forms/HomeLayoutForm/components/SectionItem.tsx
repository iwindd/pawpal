"use client";
import { IconGripVertical, IconTrash } from "@pawpal/icons";
import {
  ENUM_HOME_SECTION_TYPE,
  HomeLayoutInput,
  HomeLayoutSectionItem,
} from "@pawpal/shared";
import {
  ActionIcon,
  Card,
  Grid,
  Group,
  Text,
  TextInput,
} from "@pawpal/ui/core";
import { Draggable } from "@pawpal/ui/draggable";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

import GroupSectionConfig from "./GroupSectionConfig";
import SliderSectionConfig from "./SliderSectionConfig";

interface SectionItemProps {
  item: HomeLayoutSectionItem;
  index: number;
  form: UseFormReturnType<HomeLayoutInput>;
}

export default function SectionItem({
  item,
  index,
  form,
}: Readonly<SectionItemProps>) {
  const t = useTranslations("HomeLayout.form");

  return (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided) => (
        <Card mb="sm" ref={provided.innerRef} {...provided.draggableProps}>
          <Group justify="space-between" mb="sm" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <div {...provided.dragHandleProps}>
                <IconGripVertical
                  size={18}
                  style={{
                    color: "gray",
                    cursor: "grab",
                  }}
                />
              </div>
              <Text fw={600} c="dimmed">
                {item.type === ENUM_HOME_SECTION_TYPE.ITEM_SLIDER
                  ? t("type-slider")
                  : t("type-group")}
              </Text>
            </Group>
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => form.removeListItem("sections", index)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>

          <Grid>
            {item.type !== ENUM_HOME_SECTION_TYPE.ITEM_GROUP && (
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label={t("section-title")}
                  {...form.getInputProps(`sections.${index}.title`)}
                />
              </Grid.Col>
            )}

            {item.type === ENUM_HOME_SECTION_TYPE.ITEM_SLIDER && (
              <SliderSectionConfig index={index} form={form} />
            )}
          </Grid>

          {item.type === ENUM_HOME_SECTION_TYPE.ITEM_GROUP && (
            <GroupSectionConfig index={index} item={item} form={form} />
          )}
        </Card>
      )}
    </Draggable>
  );
}
