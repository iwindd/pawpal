import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FieldAfterParse } from '@/common/pipes/PurchasePipe';
import { AdminOrderResponse, PurchaseInput } from '@pawpal/shared';
import { Order } from './entities/order';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface IOrderRepository {
  /**
   * Find order by id
   * @param orderId the order id
   * @param where optional where clause containing partial status or other traits
   */
  find(orderId: string, where?: any): Promise<Order | null>;

  /**
   * Convert order to admin order response
   * @param orderId order id
   */
  toOrderResponse(orderId: string): Promise<AdminOrderResponse>;

  /**
   * Get product package by id
   */
  getProductPackage(packageId: string): Promise<any>;

  /**
   * Create an order and its associated wallet transaction
   */
  createOrderAndTransaction(
    userId: string,
    body: PurchaseInput<FieldAfterParse>,
    productPackage: any,
    totalPrice: any,
    userWallet: any,
    topupAmount: any,
  ): Promise<{ order: Order; transaction: any; balanceAfter: any }>;

  /**
   * Get topup order datatable
   */
  getTopupOrderDatatable(
    query: DatatableQuery,
  ): Promise<{ data: any[]; total: number }>;

  /**
   * Get order history datatable
   */
  getOrderHistoryDatatable(
    userId: string,
    query?: DatatableQuery,
  ): Promise<{ data: any[]; total: number }>;

  /**
   * Set order status to pending
   */
  setPending(orderId: string): Promise<void>;

  /**
   * Complete an order
   */
  complete(orderId: string, processedBy: string): Promise<void>;

  /**
   * Cancel an order
   */
  cancel(orderId: string, processedBy: string): Promise<void>;

  /**
   * Fail a transaction
   */
  failTransaction(transactionId: string): Promise<void>;

  /**
   * Success a transaction
   */
  successTransaction(transactionId: string, processedBy: string): Promise<void>;
}
