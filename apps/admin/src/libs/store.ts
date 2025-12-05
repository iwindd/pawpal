import { productApi } from "@/services/product";
import { transactionApi } from "@/services/transaction";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [transactionApi.reducerPath]: transactionApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionApi.middleware,
      productApi.middleware
    ),
});

setupListeners(store.dispatch);
