import {
  AdminProductPackageResponse,
  AdminProductResponse,
  DatatableInput,
  DatatableResponse,
  PackageInput,
} from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";
import { PawApiResponse } from "../../api";

class PackageApi {
  constructor(private readonly client: AxiosInstance) {}

  async create(
    id: string,
    data: PackageInput
  ): Promise<PawApiResponse<AdminProductResponse>> {
    return await this.client.post(`/admin/package/product/${id}`, data);
  }

  async getProductPackages(
    id: string,
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminProductPackageResponse>>> {
    return await this.client.get(`/admin/package/product/${id}`, {
      params,
    });
  }

  async update(
    id: string,
    data: PackageInput
  ): Promise<PawApiResponse<AdminProductPackageResponse>> {
    return await this.client.patch(`/admin/package/${id}`, data);
  }
}

export default PackageApi;
