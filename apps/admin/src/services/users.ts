import { baseQuery } from "@/configs/api";
import {
  AdminCustomerResponse,
  AdminEmployeeResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Employees", "Customers"],
  baseQuery: baseQuery({
    baseUrl: `/admin/user`,
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<
      DatatableResponse<AdminEmployeeResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/employee",
        params,
      }),
      providesTags: ["Employees"],
    }),
    getCustomers: builder.query<
      DatatableResponse<AdminCustomerResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/customer",
        params,
      }),
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetEmployeesQuery, useGetCustomersQuery } = userApi;
