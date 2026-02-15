"use client";
import ComboboxProduct from "@/components/Combobox/Product";
import ResourceInput from "@/components/Inputs/ResourceInput";
import SelectCarouselStatus from "@/components/Select/CarouselStatus";
import { DEFAULT_CAROUSEL_STATUS } from "@/configs/carousel";
import useFormValidate from "@/hooks/useFormValidate";
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
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

export type CarouselFormControl = UseFormReturnType<CarouselInput>;

interface CarouselFormProps {
  carousel?: CarouselResponse;
  onSubmit: (values: CarouselInput, form: CarouselFormControl) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  disabled?: boolean;
}

const CarouselForm = ({
  carousel,
  onSubmit,
  isLoading,
  errorMessage,
  disabled,
}: CarouselFormProps) => {
  const __ = useTranslations("Carousel.form");
  const form = useFormValidate<CarouselInput>({
    schema: carouselSchema,
    group: "carousel",
    mode: "uncontrolled",
    enhanceGetInputProps: () => ({ disabled: disabled || isLoading }),
    initialValues: {
      title: carousel?.title || "",
      resource_id: carousel?.image.id || "",
      product_id: carousel?.product?.id || "",
      status: carousel?.status || DEFAULT_CAROUSEL_STATUS,
    },
  });

  const handleSubmit = (values: CarouselInput) => {
    onSubmit(values, form);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack maw="1920">
        <Paper p="md">
          <ResourceInput
            placeholder={__("fields.resource.placeholder")}
            hint={__("fields.resource.hint")}
            h="400"
            defaultValue={carousel?.image.id}
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
                  label={__("fields.title.label")}
                  placeholder={__("fields.title.placeholder")}
                  withAsterisk
                  miw="30%"
                  key={form.key("title")}
                  {...form.getInputProps("title")}
                />

                <Stack>
                  <ComboboxProduct
                    inputProps={{
                      label: __("fields.product.label"),
                      placeholder: __("fields.product.placeholder"),
                    }}
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
              color="success"
              disabled={disabled}
              rightSection={<IconPublishShare size={16} />}
              loading={isLoading}
            >
              {__("actions.save")}
            </Button>
          </Group>
          <Group>
            <ErrorMessage
              message={errorMessage}
              formatGroup="Errors.carousel"
            />
          </Group>
        </Stack>
      </Stack>
    </form>
  );
};

export default CarouselForm;
