import { apiFetch, ApiResponse } from "@/libs/api";
import { LoginInput } from "@pawpal/shared";

const loginAction = async <T>(inputs: LoginInput): Promise<ApiResponse<T>> => {
  const response = await apiFetch<{ user: T }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(inputs),
  });

  return {
    ...response,
    data: response?.data?.user ?? undefined,
  } as ApiResponse<T>;
};

export default loginAction;
