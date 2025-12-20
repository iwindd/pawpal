import { baseQuery } from "@/configs/api";
import {
  DatatableInput,
  DatatableResponse,
  OrderResponse,
  OrderResponseType,
  PurchaseInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  tagTypes: ["Orders"],
  baseQuery: baseQuery({
    baseUrl: `/order/`,
  }),
  endpoints: (builder) => ({
    getOrderHistory: builder.query<
      DatatableResponse<OrderResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: `/`,
        params,
      }),
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation<OrderResponseType, PurchaseInput>({
      query: (payload) => ({
        url: `/`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderHistoryQuery } = orderApi;
