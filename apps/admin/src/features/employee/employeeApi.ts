import { baseQuery } from "@/configs/api";
import {
  AdminEmployeeResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  tagTypes: ["Employees"],
  baseQuery: baseQuery({
    baseUrl: `/admin/employee`,
  }),
  endpoints: (builder) => ({
    getEmployees: builder.query<
      DatatableResponse<AdminEmployeeResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Employees"],
    }),
    getEmployeeProfile: builder.query<AdminEmployeeResponse, string>({
      query: (id) => `/${id}/profile`,
      providesTags: (result, error, id) => [{ type: "Employees", id }],
    }),
    getEmployeeOrders: builder.query<
      DatatableResponse<any>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/processed-order-history`,
        params,
      }),
    }),
    getEmployeeTopups: builder.query<
      DatatableResponse<any>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/processed-topup-history`,
        params,
      }),
    }),
    getEmployeeSuspensions: builder.query<
      DatatableResponse<any>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/suspensions`,
        params,
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeProfileQuery,
  useGetEmployeeOrdersQuery,
  useGetEmployeeTopupsQuery,
  useGetEmployeeSuspensionsQuery,
} = employeeApi;
