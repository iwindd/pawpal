import { baseQuery } from "@/configs/api";
import { AdminCategoryResponse, DatatableInput } from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Categories"],
  baseQuery: baseQuery({
    baseUrl: `/admin/category`,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<AdminCategoryResponse[], DatatableInput>({
      query: (params) => ({
        url: `/`,
        params,
      }),
      providesTags: ["Categories"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
