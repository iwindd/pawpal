import {
  AdminFieldResponse,
  DatatableInput,
  DatatableResponse,
  FieldInput,
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

  async create(
    data: FieldInput,
    products?: string[]
  ): Promise<AxiosResponse<any>> {
    return await this.client.post(`/admin/field`, {
      ...data,
      products: products || [],
    });
  }
}

export default FieldApi;
