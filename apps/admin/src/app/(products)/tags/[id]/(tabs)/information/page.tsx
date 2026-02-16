"use client";
import TagForm, { CreateTagForm } from "@/components/Forms/TagForm";
import { useUpdateTagMutation } from "@/features/tag/tagApi";
import { TagInput } from "@pawpal/shared";
import { Card } from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useTag } from "../../TagContext";

const TagInformationPage = () => {
  const { tag, updateTag } = useTag();
  const __ = useTranslations("Tag");
  const messages = useTranslations("Tag.messages");

  const [updateTagMutation, { isLoading }] = useUpdateTagMutation();

  const form = CreateTagForm({
    initialValues: {
      name: tag.name,
      slug: tag.slug,
    },
    isLoading,
  });

  const onSubmit = async (values: TagInput) => {
    const { data, error } = await updateTagMutation({
      id: tag.id,
      payload: values,
    });

    if (error || !data) return;

    updateTag(data);

    Notifications.show({
      message: messages("notify.updated", { name: values.name }),
      color: "green",
    });

    form.resetDirty();
  };
  return (
    <Card>
      <Card.Header title={__("information")} />
      <Card.Section inheritPadding py="md">
        <TagForm onSubmit={onSubmit} form={form} />
      </Card.Section>
    </Card>
  );
};

export default TagInformationPage;
