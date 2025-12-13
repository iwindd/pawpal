import { baseQuery } from "@/configs/api";
import {
  PaymentChargeCreatedResponse,
  PaymentChargeCreateInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQuery({
    baseUrl: `/payment`,
  }),
  endpoints: (builder) => ({
    createCharge: builder.mutation<
      PaymentChargeCreatedResponse,
      PaymentChargeCreateInput
    >({
      query: (payload) => ({
        url: `/topup`,
        method: "POST",
        body: payload,
      }),
    }),
    confirmCharge: builder.mutation<PaymentChargeCreatedResponse, string>({
      query: (payload) => ({
        url: `/topup/${payload}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useCreateChargeMutation, useConfirmChargeMutation } = paymentApi;
