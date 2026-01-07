import { baseQuery } from "@/configs/api";
import {
  DatatableInput,
  DatatableResponse,
  PaymentChargeCreatedResponse,
  PaymentChargeCreateInput,
  TopupResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const topupApi = createApi({
  reducerPath: "topupApi",
  tagTypes: ["Topups"],
  baseQuery: baseQuery({
    baseUrl: `/topup`,
  }),
  endpoints: (builder) => ({
    getTopupHistory: builder.query<
      DatatableResponse<TopupResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: `/`,
        method: "GET",
        params,
      }),
      providesTags: ["Topups"],
    }),
    createCharge: builder.mutation<
      PaymentChargeCreatedResponse,
      PaymentChargeCreateInput
    >({
      query: (payload) => ({
        url: `/`,
        method: "POST",
        body: payload,
      }),
    }),
    confirmCharge: builder.mutation<PaymentChargeCreatedResponse, string>({
      query: (chargeId) => ({
        url: `/${chargeId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useCreateChargeMutation,
  useConfirmChargeMutation,
  useGetTopupHistoryQuery,
} = topupApi;
