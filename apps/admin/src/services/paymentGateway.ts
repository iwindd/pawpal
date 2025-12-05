import { baseQuery } from "@/configs/api";
import {
  AdminPaymentGatewayResponse,
  PromptpayManualInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const paymentGatewayApi = createApi({
  reducerPath: "paymentGatewayApi",
  tagTypes: ["PaymentGateway"],
  baseQuery: baseQuery({
    baseUrl: `/payment-gateway`,
  }),
  endpoints: (builder) => ({
    getGateway: builder.query<AdminPaymentGatewayResponse, string>({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "PaymentGateway", id }],
    }),
    updatePromptpayManualMetadata: builder.mutation<
      AdminPaymentGatewayResponse,
      PromptpayManualInput
    >({
      query: (metadata) => ({
        url: "/promptpayManualMetadata",
        method: "PATCH",
        body: metadata,
      }),
      invalidatesTags: [{ type: "PaymentGateway", id: "promptpay-manual" }],
    }),
  }),
});

export const { useGetGatewayQuery, useUpdatePromptpayManualMetadataMutation } =
  paymentGatewayApi;
