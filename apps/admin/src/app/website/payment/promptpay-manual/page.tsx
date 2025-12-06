"use client";
import {
  useGetGatewayQuery,
  useUpdatePromptpayManualMetadataMutation,
} from "@/features/paymentGateway/paymentGatewayApi";
import useFormValidate from "@/hooks/useFormValidate";
import { IconDeviceFloppy, IconQrcode } from "@pawpal/icons";
import { PromptpayManualInput, promptpayManualSchema } from "@pawpal/shared";
import { Button, Paper, Stack, TextInput } from "@pawpal/ui/core";
import { useConfirmation } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import classes from "./style.module.css";

const PromptpayManualPage = () => {
  const __ = useTranslations("PaymentGateway.PromptpayManual");
  const { confirmation } = useConfirmation();
  const { data: paymentGateway, isLoading } =
    useGetGatewayQuery("promptpay-manual");
  const [updatePromptpayManualMetadata, { isLoading: isUpdating }] =
    useUpdatePromptpayManualMetadataMutation();

  const form = useFormValidate<PromptpayManualInput>({
    schema: promptpayManualSchema,
    mode: "uncontrolled",
    enhanceGetInputProps: () => ({
      disabled: isLoading || isUpdating,
    }),
    initialValues: {
      number: paymentGateway?.metadata.number || "",
      name: paymentGateway?.metadata.name || "",
    },
  });

  const onSubmit = confirmation<PromptpayManualInput>(
    async (values) => {
      const response = await updatePromptpayManualMetadata(values);

      if (response.error) {
        return notify.show({
          message: __("Errors.try_again"),
          color: "red",
        });
      }

      notify.show({
        title: __("notify.updated.title"),
        message: __("notify.updated.message"),
        color: "green",
      });
    },
    {
      title: __("confirmation.save.title"),
      message: __("confirmation.save.message"),
    }
  );

  useEffect(() => {
    if (paymentGateway) {
      form.setValues({
        number: paymentGateway.metadata.number || "",
        name: paymentGateway.metadata.name || "",
      });
    }
  }, [paymentGateway]);

  return (
    <div>
      <Paper
        withBorder
        component="form"
        onSubmit={form.onSubmit(onSubmit)}
        p={"md"}
        className={classes.formPaper}
        title={__("sections.metadata")}
      >
        <Stack>
          <TextInput
            label={__("form.fields.number.label")}
            placeholder={__("form.fields.number.placeholder")}
            key={form.key("number")}
            {...form.getInputProps("number")}
            leftSection={<IconQrcode size={18} />}
          />

          <TextInput
            label={__("form.fields.name.label")}
            placeholder={__("form.fields.name.placeholder")}
            key={form.key("name")}
            {...form.getInputProps("name")}
          />

          <div>
            <Button
              loading={isUpdating}
              disabled={isLoading}
              leftSection={<IconDeviceFloppy size={20} />}
              type="submit"
              color="save"
            >
              {__("form.actions.save")}
            </Button>
          </div>
        </Stack>
      </Paper>
    </div>
  );
};

export default PromptpayManualPage;
