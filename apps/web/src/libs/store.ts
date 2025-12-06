import { authApi } from "@/features/auth/authApi";
import authReducer, { AuthState } from "@/features/auth/authSlice";
import { orderApi } from "@/features/order/orderApi";
import { productApi } from "@/features/product/productApi";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const makeStore = (preloadedState: { auth: AuthState }) => {
  const _store = configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        orderApi.middleware,
        productApi.middleware
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
