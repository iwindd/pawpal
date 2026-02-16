import { baseQuery } from "@/configs/api";
import {
  AdminProductResponse,
  AdminTagResponse,
  CreateTagInput,
  DatatableInput,
  DatatableResponse,
  UpdateTagInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const tagApi = createApi({
  reducerPath: "tagApi",
  tagTypes: ["Tags", "Tag"],
  baseQuery: baseQuery({
    baseUrl: `/admin/tag`,
  }),
  endpoints: (builder) => ({
    getTags: builder.query<DatatableResponse<AdminTagResponse>, DatatableInput>(
      {
        query: (params) => ({
          url: "/",
          params,
        }),
        providesTags: ["Tags"],
      },
    ),
    getTag: builder.query<AdminTagResponse, string>({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Tag", id }],
    }),
    createTag: builder.mutation<AdminTagResponse, CreateTagInput>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tags"],
    }),
    updateTag: builder.mutation<
      AdminTagResponse,
      { id: string; payload: UpdateTagInput }
    >({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => ["Tags", { type: "Tag", id }],
    }),
    deleteTag: builder.mutation<AdminTagResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags"],
    }),
    getProductsInTag: builder.query<
      DatatableResponse<AdminProductResponse>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/products`,
        params,
      }),
      providesTags: ["Tags"],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useLazyGetTagsQuery,
  useGetTagQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetProductsInTagQuery,
  useLazyGetProductsInTagQuery,
} = tagApi;
