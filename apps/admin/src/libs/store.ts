import { orderApi } from "@/services/orders";
import { packageApi } from "@/services/package";
import { paymentGatewayApi } from "@/services/paymentGateway";
import { productApi } from "@/services/product";
import { resourceApi } from "@/services/resource";
import { transactionApi } from "@/services/transaction";
import { userApi } from "@/services/users";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [transactionApi.reducerPath]: transactionApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [resourceApi.reducerPath]: resourceApi.reducer,
    [paymentGatewayApi.reducerPath]: paymentGatewayApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionApi.middleware,
      productApi.middleware,
      userApi.middleware,
      resourceApi.middleware,
      paymentGatewayApi.middleware,
      packageApi.middleware,
      orderApi.middleware
    ),
});

setupListeners(store.dispatch);
