"use client";
import API from "@/libs/api/client";
import { FieldReorderInput } from "@pawpal/shared";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

interface UseFieldReorderProps {
  productId: string;
  options?: UseMutationOptions<unknown, Error, FieldReorderInput, unknown>;
  queryClient?: QueryClient;
}

export const useFieldReorder = ({
  productId,
  options,
  queryClient,
}: UseFieldReorderProps) => {
  return useMutation(
    {
      ...options,
      mutationFn: (payload: FieldReorderInput) =>
        API.field.reorder(productId, payload),
    },
    queryClient
  );
};
