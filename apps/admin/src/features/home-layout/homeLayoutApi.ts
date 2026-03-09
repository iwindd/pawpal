import { baseQuery } from "@/configs/api";
import {
  DatatableInput,
  DatatableResponse,
  HomeLayoutInput,
  HomeLayoutResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const homeLayoutApi = createApi({
  reducerPath: "homeLayoutApi",
  baseQuery: baseQuery({
    baseUrl: `/admin/home-layout`,
  }),
  tagTypes: ["HomeLayout"],
  endpoints: (builder) => ({
    getHomeLayoutsDatatable: builder.query<
      DatatableResponse<HomeLayoutResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        method: "GET",
        params,
      }),
      providesTags: ["HomeLayout"],
    }),

    getHomeLayout: builder.query<HomeLayoutResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "HomeLayout", id }],
    }),

    createHomeLayout: builder.mutation<HomeLayoutResponse, HomeLayoutInput>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HomeLayout"],
    }),
  }),
});

export const {
  useGetHomeLayoutsDatatableQuery,
  useGetHomeLayoutQuery,
  useCreateHomeLayoutMutation,
} = homeLayoutApi;
