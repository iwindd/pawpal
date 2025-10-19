import {
  AdminFieldResponse,
  DatatableInput,
  DatatableResponse,
  FieldInput,
  FieldReorderInput,
} from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class FieldApi {
  constructor(private readonly client: AxiosInstance) {}

  async getProductFields(
    id: string,
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminFieldResponse>>> {
    return await this.client.get(`/admin/field/product/${id}`, {
      params,
    });
  }

  async reorder(
    productId: string,
    data: FieldReorderInput
  ): Promise<AxiosResponse<any>> {
    return await this.client.post(
      `/admin/field/product/${productId}/reorder`,
      data
    );
  }

  async createProductField(
    productId: string,
    data: FieldInput
  ): Promise<AxiosResponse<any>> {
    return await this.client.post(`/admin/field/product/${productId}`, {
      ...data,
    });
  }

  async update(id: string, data: FieldInput): Promise<AxiosResponse<any>> {
    return await this.client.patch(`/admin/field/${id}`, data);
  }
}

export default FieldApi;
