"use client";
import ComboboxProduct from "@/components/Combobox/Product";
import SelectCarouselStatus from "@/components/Select/CarouselStatus";
import { DEFAULT_CAROUSEL_STATUS } from "@/configs/carousel";
import useFormValidate from "@/hooks/useFormValidate";
import DropzoneTrigger from "@/hooks/useResource/triggers/DropzoneTriggger";
import API from "@/libs/api/client";
import { IconPublishShare, IconSchedule } from "@pawpal/icons";
import {
  CarouselInput,
  CarouselResponse,
  carouselSchema,
  ENUM_CAROUSEL_STATUS,
} from "@pawpal/shared";
import {
  ActionIcon,
  Button,
  Divider,
  ErrorMessage,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@pawpal/ui/core";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { refreshCarousel } from "../actions";

interface CarouselViewProps {
  carousel: CarouselResponse;
}

const CarouselView = ({ carousel }: CarouselViewProps) => {
  const __ = useTranslations("Carousel.edit");
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useFormValidate({
    schema: carouselSchema,
    group: "carousel",
    mode: "uncontrolled",
    initialValues: {
      title: carousel.title,
      resource_id: carousel.image.id,
      product_id: carousel.product?.id || "",
      status: carousel.status || DEFAULT_CAROUSEL_STATUS,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CarouselInput) => {
      return await API.carousel.update(carousel.id, payload);
    },
    onSuccess: ({ data: carousel }) => {
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      refreshCarousel(carousel.id);
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
              h="400"
              defaultValue={carousel.image.id}
              key={form.key("resource_id")}
              {...form.getInputProps("resource_id")}
            />
          </Paper>

          <Grid>
            <Grid.Col
              span={{
                base: 12,
                lg: 12,
              }}
            >
              <Paper component={Stack} gap="xs" p="md">
                <Group justify="space-between">
                  <TextInput
                    label={__("form.title.label")}
                    placeholder={__("form.title.placeholder")}
                    withAsterisk
                    miw="30%"
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                  />

                  <Stack>
                    <ComboboxProduct
                      label={__("form.product.label")}
                      placeholder={__("form.product.placeholder")}
                      key={form.key("product_id")}
                      {...form.getInputProps("product_id")}
                    />
                  </Stack>
                </Group>
                <Divider />
                <Text c="dimmed" size="xs">
                  {__("sections.info")}
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>

          <Stack gap={"xs"} align="end" py={"md"}>
            <Group component={Group} gap="md" p={0} justify="flex-end">
              <SelectCarouselStatus
                blacklist={[ENUM_CAROUSEL_STATUS.ARCHIVED]}
                variant="unstyled"
                w={150}
                checkIconPosition="right"
                comboboxProps={{ dropdownPadding: 0 }}
                styles={{
                  input: {
                    textAlign: "right",
                  },
                }}
                key={form.key("status")}
                {...form.getInputProps("status")}
              />
              {form.getValues().status === ENUM_CAROUSEL_STATUS.PUBLISHED && (
                <ActionIcon
                  size={"lg"}
                  variant="transparent"
                  color="gray"
                  disabled
                >
                  <IconSchedule size={24} />
                </ActionIcon>
              )}
              <Button
                type="submit"
                color="save"
                rightSection={<IconPublishShare size={16} />}
                loading={isPending}
              >
                {__("actions.save")}
              </Button>
            </Group>
            <Group>
              <ErrorMessage message={message} formatGroup="Errors.carousel" />
            </Group>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};

export default CarouselView;
