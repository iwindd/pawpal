import { baseQuery } from "@/configs/api";
import {
  DatatableInput,
  DatatableResponse,
  ProductDatatableInput,
  ProductResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products", "ProductFilters", "SaleProducts"],
  baseQuery: baseQuery({
    baseUrl: `/product`,
  }),
  endpoints: (builder) => ({
    getInfiniteProducts: builder.infiniteQuery<
      DatatableResponse<ProductResponse>,
      ProductDatatableInput,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const total = lastPage.total;
          const loaded = allPages.flatMap((p) => p.data).length;

          return loaded < total ? lastPageParam + 1 : undefined;
        },
      },
      query: ({ queryArg, pageParam }) => ({
        url: "/",
        params: {
          page: pageParam,
          ...queryArg,
        },
      }),
      providesTags: ["Products"],
    }),
    getInfiniteSaleProducts: builder.infiniteQuery<
      DatatableResponse<ProductResponse>,
      DatatableInput,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const total = lastPage.total;
          const loaded = allPages.flatMap((p) => p.data).length;

          return loaded < total ? lastPageParam + 1 : undefined;
        },
      },
      query: ({ queryArg, pageParam }) => ({
        url: "/sale",
        params: {
          page: pageParam,
          ...queryArg,
        },
      }),
      providesTags: ["SaleProducts"],
    }),
    searchProducts: builder.query<
      DatatableResponse<ProductResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetInfiniteProductsInfiniteQuery,
  useGetInfiniteSaleProductsInfiniteQuery,
  useLazySearchProductsQuery,
} = productApi;
