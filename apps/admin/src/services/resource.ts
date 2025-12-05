import { baseQuery } from "@/configs/api";
import {
  DatatableInput,
  DatatableResponse,
  ResourceResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const resourceApi = createApi({
  reducerPath: "resourceApi",
  tagTypes: ["Resources", "Resource"],
  baseQuery: baseQuery({
    baseUrl: `/admin/resource`,
  }),
  endpoints: (builder) => ({
    getResources: builder.query<
      DatatableResponse<ResourceResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Resources"],
    }),
    getInfiniteResources: builder.infiniteQuery<
      DatatableResponse<ResourceResponse>,
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
        url: "/",
        params: {
          page: pageParam,
          limit: queryArg.limit,
          sort: null,
        },
      }),
      providesTags: ["Resources"],
    }),
    getResource: builder.query<ResourceResponse, string>({
      query: (resourceId) => ({
        url: `/${resourceId}`,
      }),
      providesTags: (result, error, id) => [{ type: "Resource", id: id }],
    }),
    uploadResource: builder.mutation<ResourceResponse, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Resources"],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetInfiniteResourcesInfiniteQuery,
  useLazyGetResourceQuery,
  useUploadResourceMutation,
} = resourceApi;
