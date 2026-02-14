import { baseQuery } from "@/configs/api";
import {
  AdminProductResponse,
  AdminProductTagResponse,
  CreateProductTagInput,
  DatatableInput,
  DatatableResponse,
  UpdateProductTagInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productTagApi = createApi({
  reducerPath: "productTagApi",
  tagTypes: ["ProductTags", "ProductTag"],
  baseQuery: baseQuery({
    baseUrl: `/admin/product-tag`,
  }),
  endpoints: (builder) => ({
    getProductTags: builder.query<
      DatatableResponse<AdminProductTagResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["ProductTags"],
    }),
    getProductTag: builder.query<AdminProductTagResponse, string>({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "ProductTag", id }],
    }),
    createProductTag: builder.mutation<
      AdminProductTagResponse,
      CreateProductTagInput
    >({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ProductTags"],
    }),
    updateProductTag: builder.mutation<
      AdminProductTagResponse,
      { id: string; payload: UpdateProductTagInput }
    >({
      query: ({ id, payload }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        "ProductTags",
        { type: "ProductTag", id },
      ],
    }),
    deleteProductTag: builder.mutation<AdminProductTagResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductTags"],
    }),
    getProductsInTag: builder.query<
      DatatableResponse<AdminProductResponse>,
      { id: string; params: DatatableInput }
    >({
      query: ({ id, params }) => ({
        url: `/${id}/products`,
        params,
      }),
      providesTags: ["ProductTags"],
    }),
  }),
});

export const {
  useGetProductTagsQuery,
  useLazyGetProductTagsQuery,
  useGetProductTagQuery,
  useCreateProductTagMutation,
  useUpdateProductTagMutation,
  useDeleteProductTagMutation,
  useGetProductsInTagQuery,
  useLazyGetProductsInTagQuery,
} = productTagApi;
