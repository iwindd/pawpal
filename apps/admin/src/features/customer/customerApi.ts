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
    getCustomerProfile: builder.query<AdminCustomerResponse, string>({
      query: (id) => `/${id}/profile`,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),
    getCustomerOrders: builder.query<
      DatatableResponse<any>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/order-history`,
        params,
      }),
    }),
    getCustomerTopups: builder.query<
      DatatableResponse<any>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/topup-history`,
        params,
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerProfileQuery,
  useGetCustomerOrdersQuery,
  useGetCustomerTopupsQuery,
} = customerApi;
