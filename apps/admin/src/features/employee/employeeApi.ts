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
  }),
});

export const { useGetEmployeesQuery } = employeeApi;
