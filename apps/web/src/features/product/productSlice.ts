import { ProductFiltersResponse } from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductState {
  filters: ProductFiltersResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  filters: null,
  isLoading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFiltersResponse>) => {
      state.filters = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setFilters, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;
