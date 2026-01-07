import {
  OrderResponseType,
  PaymentChargeCreatedResponse,
} from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "../order/orderApi";
import { topupApi } from "./topupApi";

export interface PaymentState {
  currentCharge: PaymentChargeCreatedResponse | null;
  chargeType: OrderResponseType["type"] | null;
}

const initialState: PaymentState = {
  currentCharge: null,
  chargeType: null,
};

const topupSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearCurrentCharge(state) {
      state.currentCharge = null;
      state.chargeType = null;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      topupApi.endpoints.createCharge.matchFulfilled,
      (state, action: PayloadAction<PaymentChargeCreatedResponse>) => {
        state.currentCharge = action.payload;
        state.chargeType = "topup";
      }
    );
    builder.addMatcher(
      topupApi.endpoints.createCharge.matchRejected,
      (state) => {
        state.currentCharge = null;
        state.chargeType = null;
      }
    );
    builder.addMatcher(
      topupApi.endpoints.confirmCharge.matchFulfilled,
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

export const { clearCurrentCharge } = topupSlice.actions;
export default topupSlice.reducer;
