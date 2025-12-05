import { productApi } from "@/services/product";
import { transactionApi } from "@/services/transaction";
import { userApi } from "@/services/users";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [transactionApi.reducerPath]: transactionApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionApi.middleware,
      productApi.middleware,
      userApi.middleware
    ),
});

setupListeners(store.dispatch);
