import { baseQuery } from "@/configs/api";
import {
  AdminCustomerResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  tagTypes: ["Customers"],
  baseQuery: baseQuery({
    baseUrl: `/admin/customer`,
  }),
  endpoints: (builder) => ({
    getCustomers: builder.query<
      DatatableResponse<AdminCustomerResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetCustomersQuery } = customerApi;
