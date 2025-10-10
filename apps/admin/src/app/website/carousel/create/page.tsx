"use client";
import ComboboxProduct from "@/components/Combobox/Product";
import useFormValidate from "@/hooks/useFormValidate";
import DropzoneTrigger from "@/hooks/useResource/triggers/DropzoneTriggger";
import API from "@/libs/api/client";
import { CarouselInput, carouselSchema } from "@pawpal/shared";
import { Button, Group, Paper, Stack, TextInput } from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CarouselCreatePage = () => {
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
    <div>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack maw="1920">
          <Paper p="md">
            <DropzoneTrigger
              placeholder={__("form.resource.placeholder")}
              hint={__("form.resource.hint")}
              key={form.key("resource_id")}
              h="400"
              {...form.getInputProps("resource_id")}
            />
          </Paper>

          <Paper component={Stack} gap="md" p="md">
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
          </Paper>

          <Paper component={Group} gap="md" p="md" justify="flex-end">
            <Button type="submit" loading={isPending}>
              {__("actions.create")}
            </Button>
          </Paper>
        </Stack>
      </form>
    </div>
  );
};

export default CarouselCreatePage;
