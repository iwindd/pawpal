import { baseQuery } from "@/configs/api";
import {
  AdminCategoryResponse,
  CategoryInput,
  CategoryResponse,
  CategoryUpdateInput,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Categories", "Category"],
  baseQuery: baseQuery({
    baseUrl: `/admin/category`,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query<
      DatatableResponse<AdminCategoryResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: `/`,
        params,
      }),
      providesTags: ["Categories"],
    }),
    getCategory: builder.query<AdminCategoryResponse, string>({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<CategoryResponse, CategoryInput>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: string; body: CategoryUpdateInput }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Categories",
        { type: "Category", id },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useLazyGetCategoriesQuery,
  useGetCategoriesQuery,
  useLazyGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
