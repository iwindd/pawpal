import { baseQuery } from "@/configs/api";
import {
  AdminProductResponse,
  DatatableInput,
  DatatableResponse,
  ProductInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products", "Product"],
  baseQuery: baseQuery({
    baseUrl: `/admin/product`,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<
      DatatableResponse<AdminProductResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Products"],
    }),
    getProduct: builder.query<AdminProductResponse, string>({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<AdminProductResponse, ProductInput>({
      query: (product) => ({
        url: "/",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      AdminProductResponse,
      { id: string; product: ProductInput }
    >({
      query: ({ id, product }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Product", id },
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Products",
        { type: "Product", id },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
