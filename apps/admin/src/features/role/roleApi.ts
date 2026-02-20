import { baseQuery } from "@/configs/api";
import {
  AdminPermissionResponse,
  AdminRoleResponse,
  DatatableInput,
  DatatableResponse,
  RoleInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  tagTypes: ["Roles"],
  baseQuery: baseQuery({
    baseUrl: `/admin/role`,
  }),
  endpoints: (builder) => ({
    getRoles: builder.query<
      DatatableResponse<AdminRoleResponse>,
      DatatableInput
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["Roles"],
    }),
    getRole: builder.query<AdminRoleResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Roles", id }],
    }),
    getPermissions: builder.query<AdminPermissionResponse[], void>({
      query: () => `/permissions`,
    }),
    createRole: builder.mutation<AdminRoleResponse, RoleInput>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation<
      AdminRoleResponse,
      { id: string; body: RoleInput }
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useGetRoleQuery,
  useLazyGetRoleQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
