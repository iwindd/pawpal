import {
  AdminCustomerResponse,
  AdminEmployeeResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class UserApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getCustomers(
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminCustomerResponse>>> {
    return await this.client.get("/admin/user/customer", { params });
  }

  public async getEmployees(
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminEmployeeResponse>>> {
    return await this.client.get("/admin/user/employee", { params });
  }
}

export default UserApi;
