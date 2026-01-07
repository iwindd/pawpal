import { baseQuery } from "@/configs/api";
import { ChangeEmailInput, Session, UpdateProfileInput } from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Session"],
  baseQuery: baseQuery({
    baseUrl: `/user`,
  }),
  endpoints: (builder) => ({
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

export const { useChangeEmailMutation, useUpdateProfileMutation } = userApi;
