import { baseQuery } from "@/configs/api";
import { AdminCreateUserInput } from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Employees", "Customers"],
  baseQuery: baseQuery({
    baseUrl: `/admin/`,
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation<void, AdminCreateUserInput>({
      query: (body) => ({
        url: `user`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employees", "Customers"],
    }),
    updateUserProfile: builder.mutation<
      void,
      { id: string; profile: any; type: "customer" | "employee" }
    >({
      query: ({ id, profile, type }) => ({
        url: `${type}/${id}/profile`,
        method: "PATCH",
        body: profile,
      }),
      invalidatesTags: (result, error, { type }) => [
        type === "customer" ? "Customers" : "Employees",
      ],
    }),
    adminResetEmail: builder.mutation<
      void,
      { id: string; newEmail: string; type: "customer" | "employee" }
    >({
      query: ({ id, newEmail, type }) => ({
        url: `${type}/${id}/email`,
        method: "PATCH",
        body: { newEmail },
      }),
      invalidatesTags: (result, error, { type }) => [
        type === "customer" ? "Customers" : "Employees",
      ],
    }),
    adminResetPassword: builder.mutation<
      void,
      { id: string; newPassword: string; type: "customer" | "employee" }
    >({
      query: ({ id, newPassword, type }) => ({
        url: `${type}/${id}/password`,
        method: "PATCH",
        body: { newPassword },
      }),
    }),
    suspendUser: builder.mutation<
      void,
      { id: string; type: "customer" | "employee"; note?: string }
    >({
      query: ({ id, type, note }) => ({
        url: `${type}/${id}/suspend`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: (result, error, { type }) => [
        type === "customer" ? "Customers" : "Employees",
      ],
    }),
    unsuspendUser: builder.mutation<
      void,
      { id: string; type: "customer" | "employee"; note?: string }
    >({
      query: ({ id, type, note }) => ({
        url: `${type}/${id}/unsuspend`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: (result, error, { type }) => [
        type === "customer" ? "Customers" : "Employees",
      ],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserProfileMutation,
  useAdminResetEmailMutation,
  useAdminResetPasswordMutation,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
} = userApi;
