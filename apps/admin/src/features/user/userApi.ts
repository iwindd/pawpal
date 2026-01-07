import { baseQuery } from "@/configs/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Employees", "Customers"],
  baseQuery: baseQuery({
    baseUrl: `/admin/`,
  }),
  endpoints: (builder) => ({}),
});

export const any = userApi;
