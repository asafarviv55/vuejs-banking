import { ApiService } from './api';
import type { Transaction, TransactionFilter } from '@/models/Transaction';

export class TransactionService {
  static async getTransactions(filter?: TransactionFilter): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return ApiService.get<Transaction[]>(`/transactions${queryString}`);
  }

  static async getTransactionById(id: string): Promise<Transaction> {
    return ApiService.get<Transaction>(`/transactions/${id}`);
  }

  static async getAccountTransactions(accountId: string): Promise<Transaction[]> {
    return ApiService.get<Transaction[]>(`/accounts/${accountId}/transactions`);
  }

  static async searchTransactions(query: string): Promise<Transaction[]> {
    return ApiService.get<Transaction[]>(`/transactions/search?q=${query}`);
  }

  static async exportTransactions(filter: TransactionFilter, format: 'csv' | 'pdf'): Promise<Blob> {
    const params = new URLSearchParams({ format, ...filter as any });
    const response = await fetch(`/api/transactions/export?${params.toString()}`);
    return response.blob();
  }
}
