import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Transaction } from './entities/transaction';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface ITransactionRepository {
  /**
   * Find a transaction by id
   */
  find(transactionId: string): Promise<Transaction>;

  /**
   * Create a generic transaction
   */
  create(data: any): Promise<Transaction>;

  /**
   * Get transaction detail (extended payload shape expected by controller)
   */
  getTransactionDetail(id: string): Promise<any>;

  /**
   * Success a transaction
   */
  successInstruction(transactionId: string, processedBy: string): Promise<any>;

  /**
   * Fail a transaction
   */
  failInstruction(transactionId: string, processedBy: string): Promise<any>;

  /**
   * Assign a transaction to an admin
   */
  assignJob(transactionId: string, processedBy: string): Promise<any>;

  /**
   * Get pending transactions datatable
   */
  getJobTransactionsDatatable(query: DatatableQuery): Promise<any>;

  /**
   * Set order status to pending
   */
  setOrderPending(orderId: string): Promise<void>;

  /**
   * Get formatted order response
   */
  getOrderResponse(orderId: string): Promise<any>;
}
