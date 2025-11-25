import { ApiService } from './api';
import type { Account, AccountSummary } from '@/models/Account';

export class AccountService {
  static async getAccounts(): Promise<Account[]> {
    return ApiService.get<Account[]>('/accounts');
  }

  static async getAccountById(id: string): Promise<Account> {
    return ApiService.get<Account>(`/accounts/${id}`);
  }

  static async getAccountSummary(): Promise<AccountSummary> {
    return ApiService.get<AccountSummary>('/accounts/summary');
  }

  static async createAccount(account: Partial<Account>): Promise<Account> {
    return ApiService.post<Account>('/accounts', account);
  }

  static async updateAccount(id: string, account: Partial<Account>): Promise<Account> {
    return ApiService.put<Account>(`/accounts/${id}`, account);
  }

  static async closeAccount(id: string): Promise<void> {
    return ApiService.delete<void>(`/accounts/${id}`);
  }

  static async freezeAccount(id: string): Promise<Account> {
    return ApiService.put<Account>(`/accounts/${id}/freeze`, {});
  }

  static async unfreezeAccount(id: string): Promise<Account> {
    return ApiService.put<Account>(`/accounts/${id}/unfreeze`, {});
  }
}
