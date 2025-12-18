import { AdminOrderResponse, AdminTransactionResponse } from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "../order/orderApi";
import { transactionApi } from "../transaction/transactionApi";

export interface JobState {
  orders: AdminOrderResponse[];
  transactions: AdminTransactionResponse[];
}

const initialState: JobState = {
  orders: [],
  transactions: [],
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<AdminOrderResponse>) {
      state.orders.push(action.payload);
    },
    finishedOrder(state, action: PayloadAction<AdminOrderResponse>) {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload.id
      );
    },
    addTransaction(state, action: PayloadAction<AdminTransactionResponse>) {
      state.transactions.push(action.payload);
    },
    finishedTransaction(
      state,
      action: PayloadAction<AdminTransactionResponse>
    ) {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload.id
      );
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      orderApi.endpoints.getTopupOrders.matchFulfilled,
      (state, action) => {
        state.orders = action.payload.data;
      }
    );
    builder.addMatcher(
      transactionApi.endpoints.getTransactions.matchFulfilled,
      (state, action) => {
        state.transactions = action.payload.data;
      }
    );
  },
});

export const { addOrder, finishedOrder, addTransaction, finishedTransaction } =
  jobSlice.actions;

export default jobSlice.reducer;
