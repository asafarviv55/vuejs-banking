import { ApiService } from './api';
import type { Biller, BillPayment, BillPaymentRequest } from '@/models/BillPayment';

export class BillPaymentService {
  static async getBillers(): Promise<Biller[]> {
    return ApiService.get<Biller[]>('/billers');
  }

  static async getBillerById(id: string): Promise<Biller> {
    return ApiService.get<Biller>(`/billers/${id}`);
  }

  static async searchBillers(query: string): Promise<Biller[]> {
    return ApiService.get<Biller[]>(`/billers/search?q=${query}`);
  }

  static async getPayments(): Promise<BillPayment[]> {
    return ApiService.get<BillPayment[]>('/bill-payments');
  }

  static async getPaymentById(id: string): Promise<BillPayment> {
    return ApiService.get<BillPayment>(`/bill-payments/${id}`);
  }

  static async createPayment(payment: BillPaymentRequest): Promise<BillPayment> {
    return ApiService.post<BillPayment>('/bill-payments', payment);
  }

  static async cancelPayment(id: string): Promise<BillPayment> {
    return ApiService.put<BillPayment>(`/bill-payments/${id}/cancel`, {});
  }

  static async getScheduledPayments(): Promise<BillPayment[]> {
    return ApiService.get<BillPayment[]>('/bill-payments/scheduled');
  }

  static async updateAutoPay(id: string, enabled: boolean): Promise<BillPayment> {
    return ApiService.put<BillPayment>(`/bill-payments/${id}/auto-pay`, { enabled });
  }
}
