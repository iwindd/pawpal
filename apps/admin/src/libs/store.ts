import { authApi } from "@/features/auth/authApi";
import authReducer, { AuthState } from "@/features/auth/authSlice";
import { carouselApi } from "@/features/carousel/carouselApi";
import { categoryApi } from "@/features/category/categoryApi";
import { fieldApi } from "@/features/field/fieldApi";
import jobReducer from "@/features/job/jobSlice";
import { notificationApi } from "@/features/notification/notificationApi";
import { orderApi } from "@/features/order/orderApi";
import { packageApi } from "@/features/package/packageApi";
import { paymentGatewayApi } from "@/features/paymentGateway/paymentGatewayApi";
import { productApi } from "@/features/productApi/productApi";
import { resourceApi } from "@/features/resource/resourceApi";

import { customerApi } from "@/features/customer/customerApi";
import { employeeApi } from "@/features/employee/employeeApi";
import { transactionApi } from "@/features/transaction/transactionApi";
import { userApi } from "@/features/user/userApi";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const makeStore = (preloadedState: { auth: AuthState }) => {
  const _store = configureStore({
    reducer: {
      auth: authReducer,
      job: jobReducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [customerApi.reducerPath]: customerApi.reducer,
      [employeeApi.reducerPath]: employeeApi.reducer,
      [resourceApi.reducerPath]: resourceApi.reducer,
      [paymentGatewayApi.reducerPath]: paymentGatewayApi.reducer,
      [packageApi.reducerPath]: packageApi.reducer,
      [orderApi.reducerPath]: orderApi.reducer,
      [fieldApi.reducerPath]: fieldApi.reducer,
      [categoryApi.reducerPath]: categoryApi.reducer,
      [carouselApi.reducerPath]: carouselApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        transactionApi.middleware,
        productApi.middleware,
        userApi.middleware,
        customerApi.middleware,
        employeeApi.middleware,
        resourceApi.middleware,
        paymentGatewayApi.middleware,
        packageApi.middleware,
        orderApi.middleware,
        fieldApi.middleware,
        categoryApi.middleware,
        carouselApi.middleware,
        authApi.middleware,
        notificationApi.middleware
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
