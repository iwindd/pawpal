import {
  ChangeEmailInput,
  ChangePasswordInput,
  LoginInput,
  Session,
  UpdateProfileInput,
} from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getProfile() {
    try {
      const response = await this.client.get("/auth/profile");
      return { success: true, data: response.data };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401)
        return { success: false, data: null };

      return { success: false, data: error as AxiosError };
    }
  }

  public async login(inputs: LoginInput): Promise<PawApiResponse<Session>> {
    try {
      const response = await this.client.post("/auth/admin/login", inputs);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  public async logout(): Promise<PawApiResponse<null>> {
    try {
      const response = await this.client.post("/auth/logout");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  public async changePassword(
    inputs: ChangePasswordInput
  ): Promise<PawApiResponse<{ message: string }>> {
    try {
      const response = await this.client.post("/auth/change-password", inputs);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  public async changeEmail(
    inputs: ChangeEmailInput
  ): Promise<PawApiResponse<{ message: string }>> {
    try {
      const response = await this.client.post("/auth/change-email", inputs);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  public async updateProfile(
    inputs: UpdateProfileInput
  ): Promise<PawApiResponse<Session>> {
    try {
      const response = await this.client.post("/auth/update-profile", inputs);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default AuthApi;
