import { baseQuery } from "@/configs/api";
import {
  AdminFieldResponse,
  DatatableInput,
  DatatableResponse,
  FieldInput,
  FieldReorderInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const fieldApi = createApi({
  reducerPath: "fieldApi",
  tagTypes: ["Fields"],
  baseQuery: baseQuery({
    baseUrl: `/admin/field`,
  }),
  endpoints: (builder) => ({
    getProductFields: builder.query<
      DatatableResponse<AdminFieldResponse>,
      {
        productId: string;
        params: DatatableInput;
      }
    >({
      query: ({ productId, params }) => ({
        url: `/product/${productId}`,
        params,
      }),
      transformResponse: (response: DatatableResponse<AdminFieldResponse>) => {
        return {
          data: [...response.data].sort((a, b) => a.order - b.order),
          total: response.total,
        };
      },
      providesTags: ["Fields"],
    }),
    reorderProductField: builder.mutation<
      void,
      { productId: string; payload: FieldReorderInput }
    >({
      query: ({ productId, payload }) => ({
        url: `/product/${productId}/reorder`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Fields"],
    }),
    createProductField: builder.mutation<
      AdminFieldResponse,
      { productId: string; payload: FieldInput }
    >({
      query: ({ productId, payload }) => ({
        url: `/product/${productId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Fields"],
    }),
    updateProductFieldsBulk: builder.mutation<
      AdminFieldResponse[], // Array response from Prisma transaction
      { productId: string; payload: any } // any for FieldBulkInput due to shared package boundaries, typing as needed
    >({
      query: ({ productId, payload }) => ({
        url: `/product/${productId}/bulk`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Fields"],
    }),
    updateField: builder.mutation<
      AdminFieldResponse,
      { fieldId: string; payload: FieldInput }
    >({
      query: ({ fieldId, payload }) => ({
        url: `/${fieldId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Fields"],
    }),
  }),
});

export const {
  useGetProductFieldsQuery,
  useReorderProductFieldMutation,
  useCreateProductFieldMutation,
  useUpdateFieldMutation,
  useUpdateProductFieldsBulkMutation,
} = fieldApi;
