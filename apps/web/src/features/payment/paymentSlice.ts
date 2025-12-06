import { PaymentChargeCreatedResponse } from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { paymentApi } from "./paymentApi";

export interface PaymentState {
  currentCharge: PaymentChargeCreatedResponse | null;
}

const initialState: PaymentState = {
  currentCharge: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearCurrentCharge(state) {
      state.currentCharge = null;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      paymentApi.endpoints.createCharge.matchFulfilled,
      (state, action: PayloadAction<PaymentChargeCreatedResponse>) => {
        state.currentCharge = action.payload;
      }
    );
    builder.addMatcher(
      paymentApi.endpoints.createCharge.matchRejected,
      (state) => {
        state.currentCharge = null;
      }
    );
  },
});

export const { clearCurrentCharge } = paymentSlice.actions;
export default paymentSlice.reducer;
