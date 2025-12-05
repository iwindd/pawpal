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
  }),
});

export const { useGetTopupOrdersQuery } = orderApi;
