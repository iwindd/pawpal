"use client";
import useFormValidate from "@/hooks/useFormValidate";
import DropzoneTrigger from "@/hooks/useResource/triggers/DropzoneTriggger";
import API from "@/libs/api/client";
import { CarouselInput, carouselSchema } from "@pawpal/shared";
import { Button, Group, Modal, Stack, TextInput } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ComboboxProduct from "../Combobox/Product";

const CreateCarouselModal = ({
  opened,
  onClose,
}: Readonly<{ opened: boolean; onClose: () => void }>) => {
  const __ = useTranslations("Carousel.create");
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useFormValidate({
    schema: carouselSchema,
    group: "carousel",
    mode: "uncontrolled",
    initialValues: {
      title: "",
      resource_id: "",
      product_id: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CarouselInput) => {
      return await API.carousel.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      onClose();
      notify.show({
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "green",
      });
    },
    onError: () => setMessage("error"),
  });

  const onSubmit = async (values: CarouselInput) => {
    mutate(values);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={__("title")} size="xl">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <DropzoneTrigger
            label={__("form.resource.label")}
            hint={__("form.resource.hint")}
            key={form.key("resource_id")}
            {...form.getInputProps("resource_id")}
          />

          <TextInput
            label={__("form.title.label")}
            placeholder={__("form.title.placeholder")}
            key={form.key("title")}
            {...form.getInputProps("title")}
          />

          <ComboboxProduct
            label={__("form.product.label")}
            placeholder={__("form.product.placeholder")}
            key={form.key("product_id")}
            {...form.getInputProps("product_id")}
          />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button onClick={onClose} variant="outline" disabled={isPending}>
            {__("actions.cancel")}
          </Button>
          <Button type="submit" loading={isPending}>
            {__("actions.create")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default CreateCarouselModal;
