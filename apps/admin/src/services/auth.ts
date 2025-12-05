import { baseQuery } from "@/configs/api";
import {
  ChangeEmailInput,
  ChangePasswordInput,
  LoginInput,
  Session,
  UpdateProfileInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Session"],
  baseQuery: baseQuery({
    baseUrl: `/auth`,
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<Session, void>({
      query: () => ({
        url: `/profile`,
      }),
      providesTags: ["Session"],
    }),
    login: builder.mutation<Session, LoginInput>({
      query: (payload) => ({
        url: `/login`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Session"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Session"],
    }),
    changePassword: builder.mutation<void, ChangePasswordInput>({
      query: (payload) => ({
        url: `/change-password`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Session"],
    }),
    changeEmail: builder.mutation<void, ChangeEmailInput>({
      query: (payload) => ({
        url: `/change-email`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Session"],
    }),
    updateProfile: builder.mutation<Session, UpdateProfileInput>({
      query: (payload) => ({
        url: `/update-profile`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const {
  useLazyGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useUpdateProfileMutation,
} = authApi;
