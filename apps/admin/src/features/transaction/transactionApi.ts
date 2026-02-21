import { baseQuery } from "@/configs/api";
import {
  AdminTransactionResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "trasactionApi",
  tagTypes: ["Transactions"],
  baseQuery: baseQuery({
    baseUrl: `/admin/transaction`,
  }),
  endpoints: (builder) => ({
    getTransactions: builder.query<
      DatatableResponse<AdminTransactionResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/job",
        params,
      }),
      providesTags: ["Transactions"],
    }),
    successJobTransaction: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/job/${transactionId}/success`,
        method: "PATCH",
      }),
      invalidatesTags: ["Transactions"],
    }),
    failJobTransaction: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/job/${transactionId}/fail`,
        method: "PATCH",
      }),
      invalidatesTags: ["Transactions"],
    }),
    assignJobTransaction: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/job/${transactionId}/assign`,
        method: "PATCH",
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useSuccessJobTransactionMutation,
  useFailJobTransactionMutation,
  useAssignJobTransactionMutation,
} = transactionApi;
