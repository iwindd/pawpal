import { baseQuery } from "@/configs/api";
import {
  AdminProductResponse,
  DatatableInput,
  DatatableResponse,
  ProductInput,
  ProductStockInput,
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
    getProductStock: builder.query<ProductStockInput, string>({
      query: (id) => ({
        url: `/${id}/stock`,
      }),
      providesTags: (result, error, id) => [
        { type: "Product", id: `${id}-stock` },
      ],
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
    updateProductStock: builder.mutation<
      ProductStockInput,
      { id: string; stockData: ProductStockInput }
    >({
      query: ({ id, stockData }) => ({
        url: `/${id}/stock`,
        method: "PATCH",
        body: stockData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Product", id },
        { type: "Product", id: `${id}-stock` },
      ],
    }),
  }),
});

export const {
  useLazyGetProductsQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductStockQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStockMutation,
} = productApi;
