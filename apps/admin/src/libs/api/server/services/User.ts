import { AdminCustomerResponse, AdminEmployeeResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class UserApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getCustomerProfile(
    id: string
  ): Promise<PawApiResponse<AdminCustomerResponse>> {
    try {
      const response = await this.client.get(`/admin/customer/${id}/profile`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }

  public async getEmployeeProfile(
    id: string
  ): Promise<PawApiResponse<AdminEmployeeResponse>> {
    try {
      const response = await this.client.get(`/admin/employee/${id}/profile`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }
}

export default UserApi;
