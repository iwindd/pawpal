import { baseQuery } from "@/configs/api";
import {
  AdminCarouselResponse,
  CarouselInput,
  CarouselReorderInput,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const carouselApi = createApi({
  reducerPath: "carouselApi",
  tagTypes: ["Carousels"],
  baseQuery: baseQuery({
    baseUrl: `/admin/carousel`,
  }),
  endpoints: (builder) => ({
    getCarousels: builder.query<
      DatatableResponse<AdminCarouselResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: `/`,
        params,
      }),
      providesTags: ["Carousels"],
    }),
    getPublishedCarousels: builder.query<
      DatatableResponse<AdminCarouselResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: `/published`,
        params,
      }),
      transformResponse: (
        response: DatatableResponse<AdminCarouselResponse>
      ) => {
        return {
          data: [...response.data].sort((a, b) => a.order - b.order),
          total: response.total,
        };
      },
      providesTags: ["Carousels"],
    }),
    reorderCarousel: builder.mutation<void, CarouselReorderInput>({
      query: (payload) => ({
        url: `/reorder`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Carousels"],
    }),
    createCarousel: builder.mutation<AdminCarouselResponse, CarouselInput>({
      query: (payload) => ({
        url: `/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Carousels"],
    }),
    updateCarousel: builder.mutation<
      AdminCarouselResponse,
      { carouselId: string; payload: CarouselInput }
    >({
      query: ({ carouselId, payload }) => ({
        url: `/${carouselId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Carousels"],
    }),
  }),
});

export const {
  useGetCarouselsQuery,
  useGetPublishedCarouselsQuery,
  useReorderCarouselMutation,
  useCreateCarouselMutation,
  useUpdateCarouselMutation,
} = carouselApi;
