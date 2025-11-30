"use client";
import useFormValidate from "@/hooks/useFormValidate";
import usePaymentGateway from "@/hooks/usePaymentGateway";
import API from "@/libs/api/client";
import { IconDeviceFloppy, IconQrcode } from "@pawpal/icons";
import { PromptpayManualInput, promptpayManualSchema } from "@pawpal/shared";
import { Button, Paper, Stack, TextInput } from "@pawpal/ui/core";
import { useConfirmation } from "@pawpal/ui/hooks";
import { notify } from "@pawpal/ui/notifications";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import classes from "./style.module.css";

const PromptpayManualPage = () => {
  const __ = useTranslations("PaymentGateway.PromptpayManual");
  const { confirmation } = useConfirmation();
  const paymentGateway = usePaymentGateway("promptpay-manual");

  const updatePromptpayManualMetadata = useMutation({
    mutationKey: ["promptpayManual"],
    mutationFn: async (values: PromptpayManualInput) =>
      API.paymentGateway.updatePromptpayManualMetadata(values),
    onSuccess: () => {
      notify.show({
        title: __("notify.updated.title"),
        message: __("notify.updated.message"),
        color: "green",
      });
    },
    onError: () => {
      notify.show({
        message: __("Errors.try_again"),
        color: "red",
      });
    },
  });

  const form = useFormValidate<PromptpayManualInput>({
    schema: promptpayManualSchema,
    mode: "uncontrolled",
    enhanceGetInputProps: () => ({
      disabled:
        updatePromptpayManualMetadata.isPending || paymentGateway.isPending,
    }),
    initialValues: {
      number: paymentGateway.data?.data.metadata.number,
      name: paymentGateway.data?.data.metadata.name,
    },
  });

  const onSubmit = confirmation(updatePromptpayManualMetadata.mutate, {
    title: __("confirmation.save.title"),
    message: __("confirmation.save.message"),
  });

  useEffect(() => {
    if (paymentGateway.data) {
      form.setValues({
        number: paymentGateway.data.data.metadata.number,
        name: paymentGateway.data.data.metadata.name,
      });
    }
  }, [paymentGateway.data]);

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
              loading={updatePromptpayManualMetadata.isPending}
              disabled={paymentGateway.isPending}
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
