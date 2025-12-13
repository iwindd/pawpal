import {
  OrderResponseType,
  PaymentChargeCreatedResponse,
} from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "../order/orderApi";
import { paymentApi } from "./paymentApi";

export interface PaymentState {
  currentCharge: PaymentChargeCreatedResponse | null;
  chargeType: OrderResponseType["type"] | null;
}

const initialState: PaymentState = {
  currentCharge: null,
  chargeType: null,
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
        state.chargeType = "topup";
      }
    );
    builder.addMatcher(
      paymentApi.endpoints.createCharge.matchRejected,
      (state) => {
        state.currentCharge = null;
        state.chargeType = null;
      }
    );
    builder.addMatcher(
      orderApi.endpoints.createOrder.matchFulfilled,
      (state, action: PayloadAction<OrderResponseType>) => {
        if (action.payload.type == "topup") {
          state.currentCharge = action.payload.charge;
          state.chargeType = "purchase";
        }
      }
    );
  },
});

export const { clearCurrentCharge } = paymentSlice.actions;
export default paymentSlice.reducer;
