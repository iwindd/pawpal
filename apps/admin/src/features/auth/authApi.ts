import { baseQuery } from "@/configs/api";
import {
  ChangeEmailInput,
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
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
    register: builder.mutation<Session, RegisterInput>({
      query: (payload) => ({
        url: `/register`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Session"],
    }),
    changePassword: builder.mutation<void, ChangePasswordInput>({
      query: (payload) => ({
        url: `/change-password`,
        method: "POST",
        body: payload,
      }),
    }),
    changeEmail: builder.mutation<Session, ChangeEmailInput>({
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
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useChangeEmailMutation,
  useUpdateProfileMutation,
} = authApi;
