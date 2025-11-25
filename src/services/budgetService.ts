import { ApiService } from './api';
import type { Budget, BudgetCategory, SpendingAnalytics } from '@/models/Budget';

export class BudgetService {
  static async getBudgets(): Promise<Budget[]> {
    return ApiService.get<Budget[]>('/budgets');
  }

  static async getBudgetById(id: string): Promise<Budget> {
    return ApiService.get<Budget>(`/budgets/${id}`);
  }

  static async createBudget(budget: Partial<Budget>): Promise<Budget> {
    return ApiService.post<Budget>('/budgets', budget);
  }

  static async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
    return ApiService.put<Budget>(`/budgets/${id}`, budget);
  }

  static async deleteBudget(id: string): Promise<void> {
    return ApiService.delete<void>(`/budgets/${id}`);
  }

  static async getBudgetCategories(): Promise<BudgetCategory[]> {
    return ApiService.get<BudgetCategory[]>('/budgets/categories');
  }

  static async getSpendingAnalytics(accountId: string): Promise<SpendingAnalytics> {
    return ApiService.get<SpendingAnalytics>(`/budgets/analytics/${accountId}`);
  }
}
