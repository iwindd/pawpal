import API from "@/libs/api/client";
import { PaymentChargeCreateInput } from "@pawpal/shared";
import { Notifications } from "@pawpal/ui/notifications";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PaymentChargeCreatedResponse } from "../../../../packages/shared/dist";

const useCreateCharge = () => {
  const __ = useTranslations("Topup");
  const [latestResponse, setLatestResponse] =
    useState<PaymentChargeCreatedResponse | null>(null);
  const [promptPayModal, setPromptPayModal] = useState(false);

  const mutation = useMutation({
    mutationFn: async (input: PaymentChargeCreateInput) => {
      return API.payment.charge.create(input);
    },
    onSuccess: (data: AxiosResponse<PaymentChargeCreatedResponse>) => {
      setLatestResponse(data.data);
      setPromptPayModal(true);
    },
    onError: () => {
      setLatestResponse(null);
      setPromptPayModal(false);
      Notifications.show({
        title: __("notify.error.title"),
        message: __("notify.error.message"),
        color: "red",
      });
    },
  });

  return {
    createCharge: mutation,
    promptPayModal,
    setPromptPayModal,
    latestResponse,
  };
};

export default useCreateCharge;
