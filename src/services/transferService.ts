import { ApiService } from './api';
import type { Transfer, TransferRequest } from '@/models/Transfer';

export class TransferService {
  static async getTransfers(): Promise<Transfer[]> {
    return ApiService.get<Transfer[]>('/transfers');
  }

  static async getTransferById(id: string): Promise<Transfer> {
    return ApiService.get<Transfer>(`/transfers/${id}`);
  }

  static async createTransfer(transfer: TransferRequest): Promise<Transfer> {
    return ApiService.post<Transfer>('/transfers', transfer);
  }

  static async cancelTransfer(id: string): Promise<Transfer> {
    return ApiService.put<Transfer>(`/transfers/${id}/cancel`, {});
  }

  static async validateTransfer(transfer: TransferRequest): Promise<{ valid: boolean; message?: string }> {
    return ApiService.post<{ valid: boolean; message?: string }>('/transfers/validate', transfer);
  }

  static async getScheduledTransfers(): Promise<Transfer[]> {
    return ApiService.get<Transfer[]>('/transfers/scheduled');
  }

  static async getRecurringTransfers(): Promise<Transfer[]> {
    return ApiService.get<Transfer[]>('/transfers/recurring');
  }
}
