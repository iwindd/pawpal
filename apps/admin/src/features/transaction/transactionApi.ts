import { baseQuery } from "@/configs/api";
import {
  AdminTransactionResponse,
  DatatableInput,
  DatatableResponse,
  ENUM_TRANSACTION_STATUS,
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
        url: "/pending",
        params,
      }),
      providesTags: ["Transactions"],
    }),
    setAsSucceed: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/pending/${transactionId}`,
        method: "PATCH",
        body: {
          status: ENUM_TRANSACTION_STATUS.SUCCESS,
        },
      }),
      invalidatesTags: ["Transactions"],
    }),
    setAsFailed: builder.mutation<void, string>({
      query: (transactionId) => ({
        url: `/pending/${transactionId}`,
        method: "PATCH",
        body: {
          status: ENUM_TRANSACTION_STATUS.FAILED,
        },
      }),
      invalidatesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useSetAsFailedMutation,
  useSetAsSucceedMutation,
} = transactionApi;
