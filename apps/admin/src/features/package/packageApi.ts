import { baseQuery } from "@/configs/api";
import {
  AdminProductPackageResponse,
  DatatableInput,
  DatatableResponse,
  PackageBulkInput,
  PackageInput,
} from "@pawpal/shared";
import { createApi } from "@reduxjs/toolkit/query/react";

export const packageApi = createApi({
  reducerPath: "packageApi",
  tagTypes: ["Packages"],
  baseQuery: baseQuery({
    baseUrl: `/admin/package`,
  }),
  endpoints: (builder) => ({
    getProductPackages: builder.query<
      DatatableResponse<AdminProductPackageResponse>,
      {
        productId: string;
        params: DatatableInput;
      }
    >({
      query: ({ productId, params }) => ({
        url: `/product/${productId}`,
        params,
      }),
      providesTags: ["Packages"],
    }),
    createProductPackage: builder.mutation<
      AdminProductPackageResponse,
      { productId: string; payload: PackageInput }
    >({
      query: ({ productId, payload }) => ({
        url: `/product/${productId}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Packages"],
    }),
    updatePackage: builder.mutation<
      AdminProductPackageResponse,
      { packageId: string; payload: PackageInput }
    >({
      query: ({ packageId, payload }) => ({
        url: `/${packageId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Packages"],
    }),
    updateProductPackagesBulk: builder.mutation<
      AdminProductPackageResponse[],
      { productId: string; payload: PackageBulkInput }
    >({
      query: ({ productId, payload }) => ({
        url: `/product/${productId}/bulk`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Packages"],
    }),
  }),
});

export const {
  useGetProductPackagesQuery,
  useCreateProductPackageMutation,
  useUpdatePackageMutation,
  useUpdateProductPackagesBulkMutation,
} = packageApi;
