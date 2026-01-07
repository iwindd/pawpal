import { authApi } from "@/features/auth/authApi";
import authReducer, { AuthState } from "@/features/auth/authSlice";
import { orderApi } from "@/features/order/orderApi";
import { paymentGatewayApi } from "@/features/paymentGateway/paymentGatewayApi";
import { productApi } from "@/features/product/productApi";
import { topupApi } from "@/features/topup/topupApi";
import topupReducer from "@/features/topup/topupSlice";
import { userApi } from "@/features/user/userApi";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const makeStore = (preloadedState: { auth: AuthState }) => {
  const _store = configureStore({
    reducer: {
      auth: authReducer,
      topup: topupReducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [paymentGatewayApi.reducerPath]: paymentGatewayApi.reducer,
      [topupApi.reducerPath]: topupApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        userApi.middleware,
        orderApi.middleware,
        productApi.middleware,
        paymentGatewayApi.middleware,
        topupApi.middleware
      ),
    preloadedState,
  });

  setupListeners(_store.dispatch);
  return _store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
