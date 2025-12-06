import { baseQuery } from "@/configs/api";
import {
  DatatableInput,
  DatatableResponse,
  ProductResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  tagTypes: ["Products"],
  baseQuery: baseQuery({
    baseUrl: `/product`,
  }),
  endpoints: (builder) => ({
    getInfiniteProducts: builder.infiniteQuery<
      DatatableResponse<ProductResponse>,
      DatatableInput & {
        filters?: {
          search?: string;
          category?: string;
        };
      },
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
  }),
});

export const { useGetInfiniteProductsInfiniteQuery } = productApi;
