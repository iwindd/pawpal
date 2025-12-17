import { baseQuery } from "@/configs/api";
import {
  AdminOrderResponse,
  DatatableInput,
  DatatableResponse,
  ENUM_ORDER_STATUS,
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
        url: `/${orderId}/status`,
        method: "PATCH",
        body: { status: ENUM_ORDER_STATUS.COMPLETED },
      }),
      invalidatesTags: ["Orders"],
    }),
    cancelTopupOrder: builder.mutation<AdminOrderResponse, string>({
      query: (orderId) => ({
        url: `/${orderId}/status`,
        method: "PATCH",
        body: { status: ENUM_ORDER_STATUS.CANCELLED },
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
