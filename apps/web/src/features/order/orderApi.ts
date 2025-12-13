import { baseQuery } from "@/configs/api";
import { OrderResponseType, PurchaseInput } from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  tagTypes: ["Orders"],
  baseQuery: baseQuery({
    baseUrl: `/order/`,
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<OrderResponseType, PurchaseInput>({
      query: (payload) => ({
        url: `/`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApi;
