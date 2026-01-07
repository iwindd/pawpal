import { OrderResponseType, Session, WalletType } from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "../order/orderApi";
import { userApi } from "../user/userApi";
import { authApi } from "./authApi";

export interface AuthState {
  user: Session | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setUserBalance(
      state,
      action: PayloadAction<{
        type: WalletType;
        balance: number;
      }>
    ) {
      if (state.user) {
        state.user.userWallet[action.payload.type] = action.payload.balance;
      }
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      authApi.endpoints.getProfile.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<Session>) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
    });
    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, action: PayloadAction<Session>) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      userApi.endpoints.updateProfile.matchFulfilled,
      (state, action: PayloadAction<Session>) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      userApi.endpoints.changeEmail.matchFulfilled,
      (state, action: PayloadAction<Session>) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      orderApi.endpoints.createOrder.matchFulfilled,
      (state, action: PayloadAction<OrderResponseType>) => {
        if (state.user && action.payload.type == "purchase") {
          state.user.userWallet[action.payload.wallet.type] =
            action.payload.wallet.balance;
        }
      }
    );
  },
});

export const { setUser, setUserBalance } = authSlice.actions;
export default authSlice.reducer;
