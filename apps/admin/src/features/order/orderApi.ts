import { baseQuery } from "@/configs/api";
import {
  AdminOrderResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  tagTypes: ["Orders"],
  baseQuery: baseQuery({
    baseUrl: `/admin/order/`,
  }),
  endpoints: (builder) => ({
    getTopupOrders: builder.query<
      DatatableResponse<AdminOrderResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: `/topup`,
        params,
      }),
      providesTags: ["Orders"],
    }),
    confirmTopupOrder: builder.mutation<AdminOrderResponse, string>({
      query: (orderId) => ({
        url: `/${orderId}/completed`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),
    cancelTopupOrder: builder.mutation<AdminOrderResponse, string>({
      query: (orderId) => ({
        url: `/${orderId}/cancelled`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetTopupOrdersQuery,
  useConfirmTopupOrderMutation,
  useCancelTopupOrderMutation,
} = orderApi;
