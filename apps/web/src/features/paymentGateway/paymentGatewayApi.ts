import { baseQuery } from "@/configs/api";
import { PaymentGatewayResponse } from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const paymentGatewayApi = createApi({
  reducerPath: "paymentGatewayApi",
  tagTypes: ["ActivePaymentGateway"],
  baseQuery: baseQuery({
    baseUrl: `/payment-gateway`,
  }),
  endpoints: (builder) => ({
    getActivePaymentGateway: builder.query<PaymentGatewayResponse[], void>({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
      providesTags: ["ActivePaymentGateway"],
    }),
  }),
});

export const { useGetActivePaymentGatewayQuery } = paymentGatewayApi;
