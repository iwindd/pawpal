import { AxiosError, AxiosInstance } from "axios";

class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getProfile() {
    try {
      const response = await this.client.get("/auth/profile");
      if (response.data.userType !== "EMPLOYEE")
        return { success: false, data: null };

      return { success: true, data: response.data };
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401)
        return { success: false, data: null };

      return { success: false, data: error as AxiosError };
    }
  }
}

export default AuthApi;
