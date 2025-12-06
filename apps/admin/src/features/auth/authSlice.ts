import { Session } from "@pawpal/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
      authApi.endpoints.updateProfile.matchFulfilled,
      (state, action: PayloadAction<Session>) => {
        state.user = action.payload;
      }
    );
    builder.addMatcher(
      authApi.endpoints.changeEmail.matchFulfilled,
      (state, action: PayloadAction<Session>) => {
        state.user = action.payload;
      }
    );
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
