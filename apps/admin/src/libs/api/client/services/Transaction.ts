import {
  AdminTransactionResponse,
  DatatableInput,
  DatatableResponse,
  TransactionStatus,
} from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class TransactionApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getPendingTransactions(
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminTransactionResponse>>> {
    return await this.client.get("/admin/wallet/pending", { params });
  }

  public async changeTransactionStatus(
    transactionId: string,
    status: TransactionStatus
  ) {
    return await this.client.patch(`/admin/wallet/pending/${transactionId}`, {
      status,
    });
  }
}

export default TransactionApi;
